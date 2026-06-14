// Database Types for Supabase Schema

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joining_date: string;
  status: 'active' | 'inactive';
  created_at: string;
};

export type Payment = {
  id: string;
  student_id: string;
  payment_date: string;
  session_count: number; // 8 sessions per payment
  completed_sessions: number;
  status: 'active' | 'completed';
  created_at: string;
};

export type StudentAttendance = {
  id: string;
  student_id: string;
  payment_id: string;
  attendance_date: string;
  session_number: number; // 1-8
  marked_at: string;
  status: 'present' | 'absent';
};

export type Coach = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joining_date: string;
  status: 'active' | 'inactive';
  created_at: string;
};

export type CoachAttendance = {
  id: string;
  coach_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'leave';
  month: number; // 1-12
  year: number;
};

// Statistics Types
export type StudentStats = {
  student: Student;
  currentPayment: Payment | null;
  completedSessions: number;
  pendingSessions: number;
  isPaymentDue: boolean;
};

export type CoachStats = {
  coach: Coach;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  attendancePercentage: number;
};
