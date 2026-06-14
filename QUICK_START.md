# 🚀 Quick Start Guide - Friends Badminton Academy Attendance System

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Project (2 min)
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in details and create
4. Go to **Settings → API**
5. Copy your **Project URL** and **anon public key**

### Step 3: Set Environment Variables (1 min)
1. Create `.env.local` file in project root
2. Add these lines:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Create Database Tables
Go to Supabase dashboard → **SQL Editor** and paste this:

```sql
-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  joining_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_count INTEGER DEFAULT 8,
  completed_sessions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Attendance Table
CREATE TABLE student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  attendance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_number INTEGER NOT NULL,
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaches Table
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  joining_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach Attendance Table
CREATE TABLE coach_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  attendance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 5: Start the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

---

## 🎯 First Actions in the App

1. **Add Your Academy**: Update header in `App.tsx` if needed
2. **Add Coaches**: Go to Coaches tab, add your 4 coaches
3. **Add Students**: Go to Students tab, add all 50 students
4. **Add Payments**: Click "💳 Payment" for each student
5. **Mark Attendance**: Start recording attendance

---

## 📱 Usage Quick Reference

| Action | Steps |
|--------|-------|
| **Add Student** | Students tab → + Add New Student → Fill form |
| **Add Payment** | Student list → 💳 Payment button |
| **Mark Attendance** | Attendance tab → Click session number (1-8) |
| **View Payments Due** | Payment tab → See all students needing payment |
| **Add Coach** | Coaches tab → + Add New Coach |
| **Mark Coach Attendance** | Coaches tab → Click coach card → Present/Absent/Leave |

---

## 🌐 Deploy to the Web (Free!)

### Option 1: Vercel (Easiest)

```bash
npm install -g vercel
vercel login
vercel
```

Then add environment variables in Vercel dashboard.

### Option 2: Netlify

1. Push code to GitHub
2. Go to netlify.com
3. Click "New site from Git"
4. Select your repo
5. Add environment variables
6. Deploy!

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module '@supabase/supabase-js'` | Run `npm install @supabase/supabase-js` |
| `VITE_SUPABASE_URL is undefined` | Check `.env.local` exists and restart dev server |
| `Error connecting to Supabase` | Verify URL and key are correct in `.env.local` |

---

## 📞 Need More Help?

- **Full Setup Guide**: Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Supabase Help**: https://supabase.com/docs
- **React Help**: https://react.dev

---

**You're all set! Happy managing attendance! 🏸**
