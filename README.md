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
