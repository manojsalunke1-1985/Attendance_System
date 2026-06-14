import { useState, useEffect } from 'react';
import { studentService, paymentService } from '../services/supabaseService';
import type { Student } from '../types/database';
import '../styles/StudentManagement.css';

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newStudent = await studentService.addStudent({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        joining_date: new Date().toISOString(),
        status: 'active',
      });

      setStudents([...students, newStudent]);
      setFormData({ name: '', email: '', phone: '' });
      setIsAddingStudent(false);
    } catch (err) {
      setError('Failed to add student: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        setLoading(true);
        await studentService.deleteStudent(id);
        setStudents(students.filter(s => s.id !== id));
      } catch (err) {
        setError('Failed to delete student: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddPayment = async (studentId: string) => {
    try {
      setLoading(true);
      await paymentService.addPayment(studentId);
      alert('Payment added successfully! 8 new sessions added for this student.');
      loadStudents();
    } catch (err) {
      setError('Failed to add payment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-management">
      <div className="section-header">
        <h2>Student Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddingStudent(!isAddingStudent)}
          disabled={loading}
        >
          {isAddingStudent ? 'Cancel' : '+ Add New Student'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAddingStudent && (
        <form className="student-form" onSubmit={handleAddStudent}>
          <input
            type="text"
            placeholder="Student Name"
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
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      )}

      <div className="students-list">
        {loading && students.length === 0 ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students added yet. Click "Add New Student" to get started.</p>
        ) : (
          <div className="table-responsive">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      <span className={`status ${student.status}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>{new Date(student.joining_date).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="btn btn-small btn-info"
                        onClick={() => handleAddPayment(student.id)}
                        disabled={loading}
                        title="Add new payment (8 sessions)"
                      >
                        💳 Payment
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteStudent(student.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
