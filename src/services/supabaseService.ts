import { createClient } from '@supabase/supabase-js';
import type { Student, Payment, StudentAttendance, Coach, CoachAttendance, StudentStats, CoachStats } from '../types/database';

// Initialize Supabase - Update these with your Supabase project details
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================== STUDENT SERVICES ========================

export const studentService = {
  // Create new student
  async addStudent(student: Omit<Student, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all students
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Student[];
  },

  // Get student by ID
  async getStudent(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  // Update student
  async updateStudent(id: string, updates: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete student
  async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get student stats
  async getStudentStats(id: string): Promise<StudentStats> {
    const student = await this.getStudent(id);
    
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', id)
      .order('payment_date', { ascending: false });

    const currentPayment = payments?.[0] || null;

    if (!currentPayment) {
      return {
        student,
        currentPayment: null,
        completedSessions: 0,
        pendingSessions: 0,
        isPaymentDue: false,
      };
    }

    const { data: attendance } = await supabase
      .from('student_attendance')
      .select('*')
      .eq('payment_id', currentPayment.id)
      .eq('status', 'present');

    const completedSessions = attendance?.length || 0;
    const pendingSessions = 8 - completedSessions;

    return {
      student,
      currentPayment,
      completedSessions,
      pendingSessions,
      isPaymentDue: completedSessions >= 8,
    };
  },
};

// ======================== PAYMENT SERVICES ========================

export const paymentService = {
  // Create new payment for student
  async addPayment(studentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          student_id: studentId,
          payment_date: new Date().toISOString(),
          session_count: 8,
          completed_sessions: 0,
          status: 'active',
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as Payment;
  },

  // Get payments for student
  async getStudentPayments(studentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    return data as Payment[];
  },

  // Get payment by ID
  async getPayment(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Payment;
  },

  // Get students due for payment
  async getPaymentDueStudents() {
    const { data: students } = await supabase.from('students').select('*');
    
    if (!students) return [];

    const paymentDueStudents = [];
    
    for (const student of students) {
      const stats = await studentService.getStudentStats(student.id);
      if (stats.isPaymentDue) {
        paymentDueStudents.push(stats);
      }
    }

    return paymentDueStudents;
  },
};

// ======================== ATTENDANCE SERVICES ========================

export const attendanceService = {
  // Mark student attendance
  async markStudentAttendance(
    studentId: string,
    paymentId: string,
    sessionNumber: number,
    status: 'present' | 'absent'
  ) {
    const { data, error } = await supabase
      .from('student_attendance')
      .insert([
        {
          student_id: studentId,
          payment_id: paymentId,
          attendance_date: new Date().toISOString(),
          session_number: sessionNumber,
          marked_at: new Date().toISOString(),
          status,
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as StudentAttendance;
  },

  // Get attendance for payment
  async getPaymentAttendance(paymentId: string) {
    const { data, error } = await supabase
      .from('student_attendance')
      .select('*')
      .eq('payment_id', paymentId)
      .order('session_number', { ascending: true });
    
    if (error) throw error;
    return data as StudentAttendance[];
  },

  // Update attendance
  async updateAttendance(id: string, status: 'present' | 'absent') {
    const { data, error } = await supabase
      .from('student_attendance')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// ======================== COACH SERVICES ========================

export const coachService = {
  // Add new coach
  async addCoach(coach: Omit<Coach, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('coaches')
      .insert([coach])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all coaches
  async getCoaches() {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Coach[];
  },

  // Get coach by ID
  async getCoach(id: string) {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Coach;
  },

  // Update coach
  async updateCoach(id: string, updates: Partial<Coach>) {
    const { data, error } = await supabase
      .from('coaches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete coach
  async deleteCoach(id: string) {
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get coach stats for current month
  async getCoachStats(id: string): Promise<CoachStats> {
    const coach = await this.getCoach(id);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const { data: attendance } = await supabase
      .from('coach_attendance')
      .select('*')
      .eq('coach_id', id)
      .eq('month', month)
      .eq('year', year);

    const totalPresent = attendance?.filter(a => a.status === 'present').length || 0;
    const totalAbsent = attendance?.filter(a => a.status === 'absent').length || 0;
    const totalLeave = attendance?.filter(a => a.status === 'leave').length || 0;
    const total = totalPresent + totalAbsent + totalLeave;
    const attendancePercentage = total > 0 ? (totalPresent / total) * 100 : 0;

    return {
      coach,
      totalPresent,
      totalAbsent,
      totalLeave,
      attendancePercentage,
    };
  },
};

// ======================== COACH ATTENDANCE SERVICES ========================

export const coachAttendanceService = {
  // Mark coach attendance
  async markCoachAttendance(
    coachId: string,
    status: 'present' | 'absent' | 'leave'
  ) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data, error } = await supabase
      .from('coach_attendance')
      .insert([
        {
          coach_id: coachId,
          attendance_date: date.toISOString(),
          status,
          month,
          year,
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as CoachAttendance;
  },

  // Get coach attendance for month
  async getMonthlyAttendance(coachId: string, month: number, year: number) {
    const { data, error } = await supabase
      .from('coach_attendance')
      .select('*')
      .eq('coach_id', coachId)
      .eq('month', month)
      .eq('year', year)
      .order('attendance_date', { ascending: true });
    
    if (error) throw error;
    return data as CoachAttendance[];
  },

  // Update attendance
  async updateAttendance(id: string, status: 'present' | 'absent' | 'leave') {
    const { data, error } = await supabase
      .from('coach_attendance')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
