import { useState, useEffect } from 'react';
import { coachService, coachAttendanceService } from '../services/supabaseService';
import type { Coach, CoachStats } from '../types/database';
import '../styles/CoachManagement.css';

export function CoachManagement() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachStats, setCoachStats] = useState<Map<string, CoachStats>>(new Map());
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCoach, setExpandedCoach] = useState<string | null>(null);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const data = await coachService.getCoaches();
      setCoaches(data);

      // Load stats for all coaches
      const stats = new Map<string, CoachStats>();
      for (const coach of data) {
        const stat = await coachService.getCoachStats(coach.id);
        stats.set(coach.id, stat);
      }
      setCoachStats(stats);
    } catch (err) {
      setError('Failed to load coaches: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newCoach = await coachService.addCoach({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        joining_date: new Date().toISOString(),
        status: 'active',
      });

      setCoaches([...coaches, newCoach]);
      const stat = await coachService.getCoachStats(newCoach.id);
      setCoachStats(new Map(coachStats).set(newCoach.id, stat));
      setFormData({ name: '', email: '', phone: '' });
      setIsAddingCoach(false);
    } catch (err) {
      setError('Failed to add coach: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoach = async (id: string) => {
    if (confirm('Are you sure you want to delete this coach?')) {
      try {
        setLoading(true);
        await coachService.deleteCoach(id);
        setCoaches(coaches.filter(c => c.id !== id));
        const newStats = new Map(coachStats);
        newStats.delete(id);
        setCoachStats(newStats);
      } catch (err) {
        setError('Failed to delete coach: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAttendance = async (
    coachId: string,
    status: 'present' | 'absent' | 'leave'
  ) => {
    try {
      setLoading(true);
      await coachAttendanceService.markCoachAttendance(coachId, status);
      await loadCoaches();
    } catch (err) {
      setError('Failed to mark attendance: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coach-management">
      <div className="section-header">
        <h2>👨‍🏫 Coach Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddingCoach(!isAddingCoach)}
          disabled={loading}
        >
          {isAddingCoach ? 'Cancel' : '+ Add New Coach'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAddingCoach && (
        <form className="coach-form" onSubmit={handleAddCoach}>
          <input
            type="text"
            placeholder="Coach Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Adding...' : 'Add Coach'}
          </button>
        </form>
      )}

      <div className="month-selector">
        <label>View Attendance for:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2024, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>

      <div className="coaches-list">
        {loading && coaches.length === 0 ? (
          <p>Loading coaches...</p>
        ) : coaches.length === 0 ? (
          <p>No coaches added yet. Click "Add New Coach" to get started.</p>
        ) : (
          <div className="coaches-grid">
            {coaches.map((coach) => {
              const stat = coachStats.get(coach.id);
              return (
                <div
                  key={coach.id}
                  className="coach-card"
                  onClick={() =>
                    setExpandedCoach(expandedCoach === coach.id ? null : coach.id)
                  }
                >
                  <div className="coach-header">
                    <div className="coach-info">
                      <h3>{coach.name}</h3>
                      <p>{coach.email}</p>
                    </div>
                    <span className={`status ${coach.status}`}>{coach.status}</span>
                  </div>

                  {stat && (
                    <div className="stats-row">
                      <div className="stat">
                        <span className="label">Present</span>
                        <span className="value present">{stat.totalPresent}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Absent</span>
                        <span className="value absent">{stat.totalAbsent}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Leave</span>
                        <span className="value leave">{stat.totalLeave}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Attendance %</span>
                        <span className="value percentage">
                          {stat.attendancePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {expandedCoach === coach.id && (
                    <div className="coach-actions">
                      <button
                        className="btn btn-small btn-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAttendance(coach.id, 'present');
                        }}
                        disabled={loading}
                      >
                        ✓ Present
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAttendance(coach.id, 'absent');
                        }}
                        disabled={loading}
                      >
                        ✗ Absent
                      </button>
                      <button
                        className="btn btn-small btn-warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAttendance(coach.id, 'leave');
                        }}
                        disabled={loading}
                      >
                        📋 Leave
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCoach(coach.id);
                        }}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
