<<<<<<< HEAD
# 🎓 Student Record Management System

A **feature-rich Student Management System** built with **React**, **Tailwind CSS**, and **TypeScript** for managing student records, grades, and analytics. Designed to be **fully responsive** and user-friendly, with **localStorage persistence**—no backend required.  

**Tech Stack:** React 18, Tailwind CSS, TypeScript, Recharts, Shadcn/ui, localStorage  
**License:** MIT  

---

## 🚀 Features

### Student Management
- Add, edit, delete, and view student profiles  
- Fields: Name, USN, Email, Phone, DOB, Gender, Department, Enrollment Date, Address  
- Support for multiple subjects with marks and grades  

### Grades & Analytics
- Auto-calculation of **total marks**, **percentage**, **grade**, **CGPA**, and **pass/fail status**  
- Dashboard: top performers, department-wise distribution, pass/fail ratio, and grade distribution  

### Search & Filters
- Real-time search across all fields  
- Multi-column sorting (ascending/descending)  
- Filters: Department, Marks range, Grade, Pass/Fail  
- Quick filters: Top 10 performers, Failed students  

### Data Import & Export
- Export student data to **CSV** or **JSON**  
- Import data from CSV/JSON for bulk uploads  
- Print-friendly view  

### User Experience
- Fully responsive design (mobile, tablet, desktop)  
- Dark/light theme support  
- Smooth animations and loading states  
- Keyboard shortcuts for fast navigation  

### Data Persistence
- Uses **localStorage** for data storage  
- Auto-save on every operation  
- Reset database option with confirmation  

---

## 📂 Data Structure

Example student record:

```javascript
{
  id: "uuid-v4",
  usn: "1DS23CG077",
  name: "Gangisetty Satvik",
  email: "satvik@example.com",
  phone: "9876543210",
  dob: "2005-05-15",
  gender: "Male",
  department: "Computer Science",
  enrollmentDate: "2023-08-01",
  address: "123 Street, City",
  subjects: {
    mathematics: 85,
    physics: 90,
    chemistry: 78,
    english: 88,
    computerScience: 95
  },
  totalMarks: 436,
  percentage: 87.2,
  grade: "A",
  cgpa: 8.7,
  status: "Pass",
  rank: 5
}

🎨 Customization

Add new subjects: Update src/utils/constants.js

Modify grade boundaries: Update src/utils/calculations.js

Change theme colors: Edit tailwind.config.js

🏗️ Tech Stack
Technology	Purpose
React 18	UI Framework
Tailwind CSS	Styling & Design
Recharts	Charts & Analytics
Shadcn/ui	Component Library
localStorage	Data Persistence
React Hook Form + Zod	Form Validation
🚀 Quick Start
# Clone repository
git clone https://github.com/yourusername/student-management-system.git

# Navigate to project folder
cd student-management-system

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev


Access the app at http://localhost:3000.

📦 Production Build
# Build production files
npm run build

# Preview production build
npm run preview

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m "Add feature")

Push to branch (git push origin feature/YourFeature)

Open a Pull Request

Guidelines:

Follow existing code style

Add meaningful commit messages

Update documentation if needed

Test your changes thoroughly

🗺️ Roadmap (Future Plans)

Backend integration with Node.js/Express

Database support (MongoDB/PostgreSQL)

User authentication & roles (Admin, Teacher, Student)

Attendance and fee management modules

Email notifications & advanced reporting

Mobile application (React Native)

AI-powered insights and predictions
=======
# Student Records Intelligence Hub

A comprehensive **full-stack academic success platform** for managing student records, tracking performance, and driving data-driven decision making in educational institutions.

## 🎯 Project Overview

This is a production-ready, full-stack web application that combines modern React frontend with Node.js/Express backend, featuring AI-powered insights, predictive analytics, real-time collaboration, and email verification.

### Key Highlights
- 🤖 **AI & ML Features:** Natural language queries, smart recommendations, predictive analytics
- 📊 **Advanced Analytics:** Interactive visualizations, data quality scoring, strategy planning
- 🔐 **Secure Authentication:** JWT-based auth with email verification (Gmail integration)
- 👥 **Real-time Collaboration:** Live presence indicators, activity feeds, notifications
- 📱 **PWA Ready:** Installable, offline-capable progressive web app
- 🎨 **Modern UI:** Glassmorphism design, dark/light themes, fully responsive

## 📁 Project Structure

```
student-records-app/
├── backend/              # Node.js/Express API server
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Mongoose models (User, Student)
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (email service)
│   └── server.js        # Express server entry point
│
├── frontend/            # React application
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
│
├── EMAIL_SETUP.md       # Email verification setup guide
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-records-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-records
   JWT_SECRET=your-secret-key-change-in-production
   FRONTEND_URL=http://localhost:3000
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   NODE_ENV=development
   PORT=5000
   ```
   
   Start server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧱 Tech Stack

### Frontend
- React 19 with Hooks & Context API
- Tailwind CSS + Bootstrap utilities
- Recharts for data visualization
- Axios for API calls
- React Router for navigation
- PWA capabilities

### Backend
- Node.js with Express 5
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for emails
- Socket.io for real-time features
- bcryptjs for password hashing

## ✨ Core Features

### AI & Analytics
- Natural language query system
- Smart recommendations engine
- Predictive analytics with ML forecasting
- Advanced data visualization studio
- Strategy lab with persona analysis

### Student Management
- Complete CRUD operations
- Dual layouts (table/card grid)
- Global search and advanced filters
- Batch operations
- Import/Export (CSV/JSON)

### Tracking & Insights
- Student timeline with activity feed
- Data quality dashboard
- Attendance management
- Performance trend analysis
- Cohort pulse metrics

### Security
- Email verification (Gmail)
- JWT authentication
- Role-based access control (Admin/Teacher/Student)
- Protected routes

### Collaboration
- Real-time presence indicators
- Live activity feed
- Browser notifications
- PWA support

## 📚 Documentation

- **Frontend README:** `frontend/README.md` - Detailed frontend documentation
- **Email Setup:** `EMAIL_SETUP.md` - Gmail verification configuration guide

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Students
- `GET /api/students` - Get paginated students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/bulk-delete` - Bulk delete
- `DELETE /api/students` - Clear all (admin only)

## 🔐 User Roles

- **Admin:** Full access to all features
- **Teacher:** Add/edit/delete students, view analytics
- **Student:** Read-only access to records and insights

## 📧 Email Verification

The application includes Gmail integration for email verification. See `EMAIL_SETUP.md` for detailed setup instructions.

**Quick Setup:**
1. Enable 2-Step Verification on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add credentials to `backend/.env`

## 🛠️ Development

### Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/student-records
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=development
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Build & Deploy

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## 🐛 Troubleshooting

- **MongoDB Connection:** Ensure MongoDB is running
- **Port Conflicts:** Change PORT in `.env` or kill process
- **Email Issues:** Check SMTP credentials in `backend/.env`
- **Login Issues:** Clear localStorage: `localStorage.clear()`

## 📄 License

ISC

## 👤 Author

Built as a comprehensive academic success platform showcasing modern full-stack development skills.

---

**Perfect for:** Portfolio projects, resume showcasing, educational institutions, learning management systems.

>>>>>>> a117573 (updated project upload)
