# 🏸 Friends Badminton Academy - Attendance System

A modern, responsive web application for managing student attendance, payments, and coach attendance at Friends Badminton Academy.

## ✨ Key Features

### 👥 Student Management
- Add and manage student profiles
- Track student information (name, email, phone)
- Easy student list management

### 💳 Payment & Session Tracking
- 8 sessions per payment cycle
- Automatic payment due detection
- Payment cycle management
- Session progress tracking

### 📋 Attendance Marking
- Mark weekly attendance for each student
- Visual progress indicators (completed/pending sessions)
- Easy session completion tracking
- Automatic progress updates

### 💰 Payment Reminders
- Dashboard showing students due for payment
- One-click email and phone contact
- Real-time reminder updates
- Payment status indicators

### 👨‍🏫 Coach Management
- Add and manage coaching staff (4 coaches)
- Monthly attendance tracking per coach
- Track: Present, Absent, Leave
- Attendance statistics and percentages

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16+)
- npm (v7+)
- Supabase account (free)

### 2. Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add Supabase credentials to .env.local
```

### 3. Configure Supabase

1. Visit https://supabase.com and create a free account
2. Create a new project
3. Go to Settings → API to get your credentials
4. Update `.env.local` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 4. Set Up Database

Follow the **Database Schema** section in [SETUP_GUIDE.md](./SETUP_GUIDE.md) to create all required tables in Supabase.

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📦 Project Structure

```
Attendance_System/
├── src/
│   ├── components/          # React components
│   │   ├── StudentManagement.tsx
│   │   ├── AttendanceTracker.tsx
│   │   ├── PaymentReminder.tsx
│   │   └── CoachManagement.tsx
│   ├── services/            # API integration
│   │   └── supabaseService.ts
│   ├── styles/              # Component styles
│   ├── types/               # TypeScript types
│   │   └── database.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                  # Static assets
├── SETUP_GUIDE.md          # Comprehensive setup guide
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example            # Environment template
```

## 🏗️ Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🌐 Deployment Options

The application can be deployed on free platforms:

1. **Vercel** (Recommended)
   - Free tier includes unlimited deployments
   - Automatic CI/CD from Git
   - See SETUP_GUIDE.md for details

2. **Netlify**
   - Free tier with 100GB bandwidth
   - Git-based deployment
   - Custom domain support

3. **Firebase Hosting**
   - Free tier with 1GB storage
   - CDN included
   - Automatic SSL

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (lightning-fast bundler)
- **Styling**: CSS3 with responsive design
- **Backend**: Supabase (PostgreSQL + Real-time API)
- **Deployment**: Vercel/Netlify/Firebase

## 📋 Usage Guide

### Adding Students
1. Navigate to **Students** tab
2. Click **"+ Add New Student"**
3. Enter name, email, phone
4. Student is added and ready for payment

### Recording Payments
1. Click **"💳 Payment"** next to student name
2. Student gets 8 new sessions
3. Student now appears in Attendance tab

### Marking Attendance
1. Go to **Attendance** tab
2. Click on student card to expand
3. Click session numbers (1-8) to mark completed
4. View remaining sessions in real-time

### Payment Reminders
1. Navigate to **Payment** tab
2. View all students needing payment
3. Use quick contact buttons (Email/Phone)

### Coach Management
1. Go to **Coaches** tab
2. Add coach information
3. Mark daily attendance (Present/Absent/Leave)
4. View monthly attendance statistics

## 🔒 Data Privacy & Security

- **Encryption**: All data encrypted in transit (HTTPS)
- **Authentication**: Supabase security policies
- **Row-Level Security**: Optional RLS policies available
- **Data Backup**: Supabase automatic backups

## 🆘 Troubleshooting

### Common Issues

**Supabase Connection Error**
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Restart development server

**Attendance Not Saving**
- Ensure student has active payment
- Check browser console for errors (F12)
- Verify Supabase tables are created

**Environment Variables Not Loading**
- Ensure `.env.local` file exists
- Variables must start with `VITE_`
- Restart dev server after adding variables

For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

## 📞 Support & Documentation

- **Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Supabase Docs**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Vite Guide**: https://vitejs.dev

## 📄 License

ISC

## 🎯 Features Roadmap

Future enhancements:
- [ ] SMS notifications for payments
- [ ] Student performance reports
- [ ] Monthly attendance reports for coaches
- [ ] Payment history exports
- [ ] Student feedback/ratings system
- [ ] Dark mode
- [ ] Mobile app

## 🤝 Contributing

To contribute improvements:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## 📈 Performance Metrics

- **Load Time**: < 2 seconds
- **Responsive**: Works on mobile, tablet, desktop
- **Real-time Updates**: Instant data sync via Supabase
- **Database Queries**: Optimized with indexes

---

**Made with ❤️ for Friends Badminton Academy**

Happy coaching! 🏸

