import { useState } from 'react'
import { StudentManagement } from './components/StudentManagement'
import { AttendanceTracker } from './components/AttendanceTracker'
import { PaymentReminder } from './components/PaymentReminder'
import { CoachManagement } from './components/CoachManagement'
import './App.css'

type Tab = 'dashboard' | 'students' | 'attendance' | 'payment' | 'coaches'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🏸 Friends Badminton Academy</h1>
          <p>Attendance & Payment Management System</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Students
        </button>
        <button
          className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          📋 Attendance
        </button>
        <button
          className={`nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          💰 Payment
        </button>
        <button
          className={`nav-btn ${activeTab === 'coaches' ? 'active' : ''}`}
          onClick={() => setActiveTab('coaches')}
        >
          👨‍🏫 Coaches
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="welcome-section">
              <h2>Welcome to the Attendance System!</h2>
              <p>Select a section from the menu to manage:</p>
              <ul className="feature-list">
                <li>👥 Add and manage students</li>
                <li>📋 Mark weekly attendance</li>
                <li>💳 Track payments and sessions</li>
                <li>💰 Get payment reminders</li>
                <li>👨‍🏫 Manage coach attendance</li>
              </ul>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <h3>Students</h3>
                <p>Manage your student list</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📋</span>
                <h3>Attendance</h3>
                <p>Track weekly sessions</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <h3>Payments</h3>
                <p>View payment reminders</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👨‍🏫</span>
                <h3>Coaches</h3>
                <p>Track coach attendance</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'payment' && <PaymentReminder />}
        {activeTab === 'coaches' && <CoachManagement />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Friends Badminton Academy. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
