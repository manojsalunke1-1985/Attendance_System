import { useState, useEffect } from 'react';
import { studentService, attendanceService, paymentService } from '../services/supabaseService';
import type { StudentStats } from '../types/database';
import '../styles/AttendanceTracker.css';

export function AttendanceTracker() {
  const [studentStats, setStudentStats] = useState<StudentStats[]>([]);
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

      setStudentStats(stats.filter(s => s.currentPayment !== null));
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
                          const isCompleted = sessionNum <= stat.completedSessions;

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
                              title={`Session ${sessionNum}`}
                            >
                              {isCompleted ? '✓' : sessionNum}
                            </button>
                          );
                        })}
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
