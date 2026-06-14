-- Friends Badminton Academy Attendance System
-- Paste this into the Supabase SQL Editor and run it.

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  joining_date timestamptz not null,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index if not exists idx_students_status on students(status);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  payment_date timestamptz not null,
  session_count integer default 8,
  completed_sessions integer default 0,
  status text default 'active' check (status in ('active', 'completed')),
  created_at timestamptz default now()
);

create index if not exists idx_payments_student on payments(student_id);
create index if not exists idx_payments_status on payments(status);

create table if not exists student_attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  payment_id uuid not null references payments(id) on delete cascade,
  attendance_date timestamptz not null,
  session_number integer not null check (session_number >= 1 and session_number <= 8),
  marked_at timestamptz not null,
  status text default 'present' check (status in ('present', 'absent')),
  created_at timestamptz default now()
);

create index if not exists idx_attendance_payment on student_attendance(payment_id);
create index if not exists idx_attendance_student on student_attendance(student_id);

create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  joining_date timestamptz not null,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index if not exists idx_coaches_status on coaches(status);

create table if not exists coach_attendance (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches(id) on delete cascade,
  attendance_date timestamptz not null,
  status text not null check (status in ('present', 'absent', 'leave')),
  month integer not null check (month >= 1 and month <= 12),
  year integer not null,
  created_at timestamptz default now()
);

create index if not exists idx_coach_attendance_coach on coach_attendance(coach_id);
create index if not exists idx_coach_attendance_month on coach_attendance(month, year);
