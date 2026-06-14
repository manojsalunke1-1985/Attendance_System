# Friends Badminton Academy - Attendance System
## Complete Setup & Deployment Guide

---

## 📋 Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Supabase Setup](#supabase-setup)
5. [Database Schema](#database-schema)
6. [Development](#development)
7. [Building](#building)
8. [Deployment](#deployment)
9. [Usage Guide](#usage-guide)

---

## ✨ Features

### Student Management
- ✅ Add and manage student profiles
- ✅ Track student information (name, email, phone)
- ✅ Manage active/inactive status

### Payment & Session Tracking
- ✅ 8 sessions per payment cycle
- ✅ Automatic payment due detection
- ✅ Payment reminder dashboard
- ✅ Session completion tracking

### Attendance Marking
- ✅ Mark weekly attendance per student
- ✅ Track completed vs pending sessions
- ✅ Visual session progress indicators

### Coach Management
- ✅ Add and manage coach profiles
- ✅ Monthly attendance tracking per coach
- ✅ Attendance statistics (Present, Absent, Leave)
- ✅ Attendance percentage calculation

### Payment Reminders
- ✅ Automatically identify students due for payment
- ✅ Quick contact options (Email, Phone)
- ✅ Real-time reminder updates

---

## 🛠️ Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **npm** (v7 or higher)
   - Comes with Node.js

3. **Supabase Account** (Free)
   - Sign up at: https://supabase.com
   - Free tier includes:
     - PostgreSQL database
     - Real-time updates
     - Authentication
     - Storage

4. **Text Editor/IDE**
   - VS Code (Recommended)
   - Download from: https://code.visualstudio.com/

---

## 📦 Installation

### Step 1: Clone/Download the Project

```bash
cd Attendance_System
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details:
   - Project name: "Friends Badminton Academy"
   - Password: Create a strong password
   - Region: Select closest to your location
4. Click "Create new project" (Wait 2-3 minutes for setup)

### Step 4: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Copy:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon public` key (VITE_SUPABASE_ANON_KEY)

### Step 5: Configure Environment

1. Create `.env.local` file in project root:
   ```bash
   # Copy from .env.example
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🗄️ Supabase Setup

### Create Database Tables

Go to **Supabase Dashboard → SQL Editor** and execute the following SQL queries:

#### 1. Create Students Table

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  joining_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_students_status ON students(status);
```

#### 2. Create Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_count INTEGER DEFAULT 8,
  completed_sessions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### 3. Create Student Attendance Table

```sql
CREATE TABLE student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  attendance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_number INTEGER NOT NULL CHECK (session_number >= 1 AND session_number <= 8),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_attendance_payment ON student_attendance(payment_id);
CREATE INDEX idx_attendance_student ON student_attendance(student_id);
```

#### 4. Create Coaches Table

```sql
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  joining_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_coaches_status ON coaches(status);
```

#### 5. Create Coach Attendance Table

```sql
CREATE TABLE coach_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  attendance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_coach_attendance_coach ON coach_attendance(coach_id);
CREATE INDEX idx_coach_attendance_month ON coach_attendance(month, year);
```

### Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_attendance ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for anonymous access)
CREATE POLICY "Allow public read/write on students" ON students
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on payments" ON payments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on student_attendance" ON student_attendance
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on coaches" ON coaches
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on coach_attendance" ON coach_attendance
  FOR ALL USING (true) WITH CHECK (true);
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Features Available in Development

- ✅ Hot Module Replacement (HMR) - auto-refresh on code changes
- ✅ Full debugging capabilities
- ✅ Development error messages

### File Structure

```
Attendance_System/
├── src/
│   ├── components/
│   │   ├── StudentManagement.tsx
│   │   ├── AttendanceTracker.tsx
│   │   ├── PaymentReminder.tsx
│   │   └── CoachManagement.tsx
│   ├── services/
│   │   └── supabaseService.ts
│   ├── styles/
│   │   ├── StudentManagement.css
│   │   ├── AttendanceTracker.css
│   │   ├── PaymentReminder.css
│   │   └── CoachManagement.css
│   ├── types/
│   │   └── database.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 🏗️ Building

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Preview Production Build Locally

```bash
npm run preview
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easy)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - In Vercel dashboard, go to project settings
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Push to GitHub** (Create a GitHub account if you don't have one)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your GitHub repository
   - Add environment variables in site settings

3. **Deploy**
   - Netlify automatically deploys on push

### Option 3: Supabase Hosting

Supabase offers free hosting through Vercel integration:

1. Go to Supabase dashboard
2. Click "Deploy"
3. Follow the prompts to connect your repository

### Option 4: Firebase Hosting

1. Install Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase
   ```bash
   firebase init
   ```

3. Deploy
   ```bash
   firebase deploy
   ```

---

## 📚 Usage Guide

### 1. Student Management

**Adding Students:**
1. Go to **Students** tab
2. Click **"+ Add New Student"**
3. Fill in: Name, Email, Phone
4. Click **"Add Student"**

**Adding Payment (8 Sessions):**
1. Click **"💳 Payment"** button next to student name
2. 8 new sessions will be assigned
3. Student now has an active payment cycle

### 2. Marking Attendance

**To Mark Student Attendance:**
1. Go to **Attendance** tab
2. Find the student (only shows students with active payments)
3. Click to expand student card
4. Click session number (1-8) to mark as completed
5. Completed sessions show as ✓
6. When all 8 sessions are done, "💰 PAYMENT DUE" appears

**Complete Payment Cycle:**
1. Once all 8 sessions are completed
2. Click **"✓ Complete Payment & Add New"**
3. This creates a new 8-session cycle

### 3. Payment Reminders

**View Students Due for Payment:**
1. Go to **Payment** tab
2. See all students needing payment
3. Click **"📧 Send Email"** or **"📞 Call"** for quick contact

### 4. Coach Management

**Adding Coaches:**
1. Go to **Coaches** tab
2. Click **"+ Add New Coach"**
3. Fill in: Name, Email, Phone
4. Click **"Add Coach"**

**Marking Coach Attendance:**
1. Select month and year
2. Click on coach card to expand
3. Click:
   - **✓ Present** - Mark present
   - **✗ Absent** - Mark absent
   - **📋 Leave** - Mark leave

**View Attendance Stats:**
1. See stats on each coach card:
   - Present count
   - Absent count
   - Leave count
   - Attendance percentage

---

## 🔧 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install @supabase/supabase-js
```

### Issue: Environment variables not loading

**Solution:**
1. Make sure `.env.local` file exists
2. Restart development server (`npm run dev`)
3. Verify variable names (must start with `VITE_`)

### Issue: Supabase connection errors

**Solution:**
1. Check Supabase URL and key in `.env.local`
2. Verify tables are created in Supabase
3. Check Row Level Security policies

### Issue: Attendance not updating

**Solution:**
1. Check browser console for errors (F12)
2. Verify payment record exists for student
3. Ensure student has active payment status

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check React documentation: https://react.dev

---

## 📄 License

ISC

---

## 🎯 Next Steps After Deployment

1. ✅ Verify all features work on live site
2. ✅ Add all students
3. ✅ Create initial payments
4. ✅ Start marking attendance
5. ✅ Track coach attendance
6. ✅ Monitor payment reminders

---

**Happy teaching! 🏸**
