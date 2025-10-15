🎓 Student Record Management System

A feature-rich Student Management System built with React, Tailwind CSS, and TypeScript for managing student profiles, grades, and academic analytics. Designed to be fully responsive, easy to use, and requires no backend thanks to localStorage persistence.

Tech Stack: React 18, Tailwind CSS, TypeScript, Recharts, Shadcn/ui, localStorage
License: MIT

🚀 Features
Student Management

Add, edit, delete, and view detailed student profiles

Supports multiple subjects with marks and grades

Profile fields: Name, USN, Email, Phone, DOB, Gender, Department, Enrollment Date, Address

Grades & Analytics

Auto-calculates total marks, percentage, grade, CGPA, and pass/fail status

Dashboard with top performers, department-wise distribution, pass/fail ratio, and grade distribution

Search & Filters

Real-time search across all fields

Multi-column sorting (ascending/descending)

Advanced filters: Department, Marks range, Grade, Pass/Fail

Quick filters: Top 10 performers, Failed students

Data Import & Export

Export student data to CSV or JSON

Import data from CSV/JSON for bulk uploads

Print-friendly view

User Experience

Fully responsive (mobile, tablet, desktop)

Dark/light theme support

Keyboard shortcuts for fast navigation

Smooth transitions and loading states

Data Persistence

Uses localStorage to store all student data

Auto-saves on every operation

Reset database option with confirmation

📂 Data Structure

Example of a student record:

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
Tailwind CSS	Styling
Recharts	Charts & Analytics
Shadcn/ui	Component Library
localStorage	Data Persistence
React Hook Form + Zod	Form Validation
🚀 Quick Start
# Clone the repository
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


Application runs at http://localhost:3000.

📦 Production Build
# Build optimized production files
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
