import { useState, useEffect } from 'react';
import { studentService, attendanceService, paymentService } from '../services/supabaseService';
import type { StudentStats, StudentAttendance } from '../types/database';
import '../styles/AttendanceTracker.css';

export function AttendanceTracker() {
  const [studentStats, setStudentStats] = useState<StudentStats[]>([]);
  const [attendanceByPayment, setAttendanceByPayment] = useState<Record<string, StudentAttendance[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    loadStudentStats();
  }, []);

  const loadStudentStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const students = await studentService.getStudents();
      const stats = await Promise.all(
        students.map(s => studentService.getStudentStats(s.id))
      );

      const activeStats = stats.filter(s => s.currentPayment !== null);
      setStudentStats(activeStats);

      const attendanceEntries = await Promise.all(
        activeStats.map(async (s) => {
          const paymentId = s.currentPayment!.id;
          const records = await attendanceService.getPaymentAttendance(paymentId);
          return [paymentId, records] as const;
        })
      );

      const attendanceMap: Record<string, StudentAttendance[]> = {};
      attendanceEntries.forEach(([paymentId, records]) => {
        attendanceMap[paymentId] = records;
      });

      setAttendanceByPayment(attendanceMap);
    } catch (err) {
      setError('Failed to load student stats: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (
    studentId: string,
    paymentId: string,
    sessionNumber: number,
    status: 'present' | 'absent'
  ) => {
    try {
      setLoading(true);
      await attendanceService.markStudentAttendance(
        studentId,
        paymentId,
        sessionNumber,
        status
      );

      // Reload stats
      await loadStudentStats();
    } catch (err) {
      setError('Failed to mark attendance: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (studentId: string) => {
    if (confirm('Mark this payment cycle as completed and add a new one?')) {
      try {
        setLoading(true);
        await paymentService.addPayment(studentId);
        await loadStudentStats();
        alert('New payment cycle added! 8 new sessions assigned.');
      } catch (err) {
        setError('Failed to complete payment: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && studentStats.length === 0) {
    return <div className="loading">Loading attendance data...</div>;
  }

  const getSessionDate = (paymentId: string, sessionNumber: number) => {
    const records = attendanceByPayment[paymentId] || [];
    const record = records.find(
      (r) => r.session_number === sessionNumber && r.status === 'present'
    );

    if (!record) return null;
    return new Date(record.attendance_date).toLocaleDateString();
  };

  return (
    <div className="attendance-tracker">
      <div className="section-header">
        <h2>📋 Mark Attendance</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {studentStats.length === 0 ? (
        <div className="no-data">
          <p>No students with active payments found.</p>
          <p>Please add students and create payments first.</p>
        </div>
      ) : (
        <div className="attendance-list">
          {studentStats.map((stat) => (
            <div key={stat.student.id} className="student-attendance-card">
              <div
                className="card-header"
                onClick={() =>
                  setExpandedStudent(
                    expandedStudent === stat.student.id ? null : stat.student.id
                  )
                }
              >
                <div className="student-info">
                  <h3>{stat.student.name}</h3>
                  <p>{stat.student.email}</p>
                </div>
                <div className="stats-summary">
                  <span className="completed">✅ {stat.completedSessions}/8</span>
                  <span className="pending">⏳ {stat.pendingSessions} pending</span>
                  {stat.isPaymentDue && (
                    <span className="payment-due">💰 PAYMENT DUE</span>
                  )}
                </div>
                <button className="expand-btn">
                  {expandedStudent === stat.student.id ? '▼' : '▶'}
                </button>
              </div>

              {expandedStudent === stat.student.id && (
                <div className="card-content">
                  {stat.currentPayment && (
                    <>
                      <div className="payment-info">
                        <p>
                          Payment Date:{' '}
                          {new Date(stat.currentPayment.payment_date).toLocaleDateString()}
                        </p>
                        <p>Completed: {stat.completedSessions}/8 sessions</p>
                        <p>Remaining: {stat.pendingSessions} sessions</p>
                      </div>

                      <div className="sessions-grid">
                        {Array.from({ length: 8 }).map((_, i) => {
                          const sessionNum = i + 1;
                          const sessionDate = getSessionDate(stat.currentPayment!.id, sessionNum);
                          const isCompleted = sessionDate !== null;

                          return (
                            <button
                              key={i}
                              className={`session-btn ${isCompleted ? 'completed' : 'pending'}`}
                              onClick={() =>
                                handleMarkAttendance(
                                  stat.student.id,
                                  stat.currentPayment!.id,
                                  sessionNum,
                                  'present'
                                )
                              }
                              disabled={loading || isCompleted}
                              title={
                                isCompleted
                                  ? `Session ${sessionNum} attended on ${sessionDate}`
                                  : `Session ${sessionNum}`
                              }
                            >
                              {isCompleted ? '✓' : sessionNum}
                            </button>
                          );
                        })}
                      </div>

                      <div className="payment-info">
                        <p><strong>Session Attendance Dates:</strong></p>
                        {Array.from({ length: 8 })
                          .map((_, i) => i + 1)
                          .filter((sessionNum) => getSessionDate(stat.currentPayment!.id, sessionNum))
                          .map((sessionNum) => (
                            <p key={sessionNum}>
                              Session {sessionNum}: {getSessionDate(stat.currentPayment!.id, sessionNum)}
                            </p>
                          ))}
                        {stat.completedSessions === 0 && <p>No attendance marked yet.</p>}
                      </div>

                      {stat.isPaymentDue && (
                        <button
                          className="btn btn-success btn-block"
                          onClick={() => handleCompletePayment(stat.student.id)}
                          disabled={loading}
                        >
                          ✓ Complete Payment & Add New
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
