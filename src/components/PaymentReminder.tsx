import { useState, useEffect } from 'react';
import { paymentService } from '../services/supabaseService';
import type { StudentStats } from '../types/database';
import '../styles/PaymentReminder.css';

export function PaymentReminder() {
  const [paymentDueStudents, setPaymentDueStudents] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentDueStudents();
    // Refresh every 30 seconds
    const interval = setInterval(loadPaymentDueStudents, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPaymentDueStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const students = await paymentService.getPaymentDueStudents();
      setPaymentDueStudents(students);
    } catch (err) {
      setError('Failed to load payment due students: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && paymentDueStudents.length === 0) {
    return <div className="loading">Loading payment reminders...</div>;
  }

  return (
    <div className="payment-reminder">
      <div className="section-header">
        <h2>💰 Payment Reminders</h2>
        <button className="btn btn-secondary" onClick={loadPaymentDueStudents} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {paymentDueStudents.length === 0 ? (
        <div className="no-reminders">
          <div className="checkmark">✓</div>
          <p>No pending payments! All students are up to date. 🎉</p>
        </div>
      ) : (
        <div className="reminders-container">
          <div className="reminder-count">
            {paymentDueStudents.length} student{paymentDueStudents.length !== 1 ? 's' : ''} need{'s'} to pay
          </div>

          <div className="reminders-grid">
            {paymentDueStudents.map((stat) => (
              <div key={stat.student.id} className="reminder-card">
                <div className="reminder-header">
                  <h3>{stat.student.name}</h3>
                  <span className="due-badge">PAYMENT DUE</span>
                </div>

                <div className="reminder-details">
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{stat.student.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{stat.student.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Sessions Completed:</span>
                    <span className="value">{stat.completedSessions}/8</span>
                  </div>
                  {stat.currentPayment && (
                    <div className="detail-row">
                      <span className="label">Last Payment:</span>
                      <span className="value">
                        {new Date(stat.currentPayment.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="reminder-actions">
                  <a href={`mailto:${stat.student.email}`} className="btn btn-small btn-info">
                    📧 Send Email
                  </a>
                  <a href={`tel:${stat.student.phone}`} className="btn btn-small btn-warning">
                    📞 Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
