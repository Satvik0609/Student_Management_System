# 🎓 Student Record Management System

A comprehensive, feature-rich Student Management System built with React that provides complete academic administration capabilities with an intuitive interface and powerful analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)

## 📸 Screenshots

![Dashboard Overview](./screenshots/dashboard.png)
*Analytics Dashboard with real-time statistics and charts*

![Student Management](./screenshots/students.png)
*Student list with advanced filtering and sorting*

![Student Profile](./screenshots/profile.png)
*Detailed student profile with multi-subject grades*

---

## ✨ Features

### 🔍 Advanced Search & Filter
- **Real-time search** across all fields (Name, USN, Department, Marks)
- **Multi-column sorting** with ascending/descending order
- **Advanced filters**: Department, Grade range, Marks range, Pass/Fail status
- **Active filter tags** with one-click removal
- **Quick filters**: Top 10 performers, Failed students

### 📊 Comprehensive Analytics Dashboard
- **Total Students** count with trend indicators
- **Average Performance** metrics (marks, percentage, CGPA)
- **Top Performer** highlight card
- **Department-wise Distribution** (Interactive bar chart)
- **Pass/Fail Ratio** (Pie chart visualization)
- **Grade Distribution** (A+, A, B+, B, C, F breakdown)

### 🎯 Multi-Subject Grade Management
- Support for **5 core subjects**: Mathematics, Physics, Chemistry, English, Computer Science
- **Individual subject marks** (0-100 validation)
- **Auto-calculated metrics**:
  - Total Marks
  - Percentage
  - Grade (A+, A, B+, B, C, F)
  - CGPA (out of 10)
  - Pass/Fail Status
- **Class Ranking** based on percentage

### 👥 Complete Student Profiles
- **Personal Information**: Name, USN, Email, Phone, DOB, Gender, Address
- **Academic Details**: Department, Enrollment Date, Subject-wise grades
- **Photo Upload** with preview functionality
- **Detailed View Modal** for comprehensive student information

### 🛠️ Advanced CRUD Operations
- **Modal-based forms** for Add/Edit operations
- **Comprehensive validation** with field-specific error messages
- **Bulk operations**: Select multiple students, bulk delete
- **Confirmation dialogs** before destructive actions
- **Undo functionality** for last deletion
- **Toast notifications** for all operations

### 📁 Import/Export Capabilities
- **Export to CSV** for Excel compatibility
- **Export to JSON** for backup purposes
- **Import from CSV/JSON** for bulk data upload
- **Print-friendly view** with optimized layout

### 🎨 Modern UI/UX
- **Fully responsive** design (Mobile, Tablet, Desktop)
- **Dark/Light theme** support
- **Smooth animations** and transitions
- **Loading states** with spinners
- **Empty states** with helpful messages
- **Keyboard shortcuts** for power users
- **Accessible design** with ARIA labels

### 💾 Data Management
- **localStorage persistence** - No backend required
- **Auto-save** on every operation
- **Last saved timestamp** display
- **Reset database** option with confirmation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/student-management-system.git

# Navigate to project directory
cd student-management-system

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:3000`

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Tailwind CSS** | Styling & Design |
| **Lucide React** | Icon Library |
| **Recharts** | Data Visualization |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation |
| **Shadcn/ui** | Component Library |
| **React Context** | State Management |
| **localStorage API** | Data Persistence |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── StatCard.jsx
│   │   └── Charts/
│   ├── Students/
│   │   ├── StudentTable.jsx
│   │   ├── StudentForm.jsx
│   │   ├── StudentDetails.jsx
│   │   └── StudentRow.jsx
│   ├── Filters/
│   │   ├── SearchBar.jsx
│   │   ├── AdvancedFilters.jsx
│   │   └── FilterTags.jsx
│   ├── UI/
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Toast.jsx
│   │   └── Pagination.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── hooks/
│   ├── useLocalStorage.js
│   ├── useStudents.js
│   ├── useSearch.js
│   └── useToast.js
├── utils/
│   ├── validators.js
│   ├── calculations.js
│   ├── exportData.js
│   └── constants.js
├── context/
│   └── StudentContext.jsx
├── App.jsx
└── main.jsx
```

---

## 🎯 Key Features Explained

### 1. Grade Calculation System

The system automatically calculates grades based on percentage:

| Grade | Percentage Range | CGPA |
|-------|-----------------|------|
| A+ | 90-100 | 9.0-10.0 |
| A | 80-89 | 8.0-8.9 |
| B+ | 70-79 | 7.0-7.9 |
| B | 60-69 | 6.0-6.9 |
| C | 50-59 | 5.0-5.9 |
| F | Below 50 | Below 5.0 |

### 2. Validation Rules

- **USN**: Must be unique, alphanumeric
- **Name**: Minimum 3 characters, letters and spaces only
- **Email**: Valid email format
- **Phone**: Exactly 10 digits
- **Marks**: Between 0-100 for each subject
- **Department**: Required selection

### 3. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Add new student |
| `Ctrl/Cmd + F` | Focus search bar |
| `Escape` | Close modal |

---

## 📊 Data Structure

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
  photo: "base64-string",
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
```

---

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Blue
        secondary: '#8B5CF6',  // Purple
        accent: '#10B981',     // Green
      }
    }
  }
}
```

### Adding New Subjects

Edit `src/utils/constants.js`:

```javascript
export const SUBJECTS = [
  'mathematics',
  'physics',
  'chemistry',
  'english',
  'computerScience',
  'biology',        // Add new subjects
  'economics'       // Add new subjects
];
```

### Modifying Grade Boundaries

Edit `src/utils/calculations.js`:

```javascript
export const calculateGrade = (percentage) => {
  if (percentage >= 95) return 'A+';
  if (percentage >= 85) return 'A';
  // Modify thresholds as needed
};
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build files will be in the `dist/` directory.

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/student-management-system",

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 🐛 Known Issues

- [ ] Large datasets (10,000+ students) may cause performance issues
- [ ] Export to PDF feature pending implementation
- [ ] Mobile landscape mode needs optimization

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Backend integration with Node.js/Express
- [ ] Database support (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Role-based access control (Admin, Teacher, Student)
- [ ] Attendance tracking module
- [ ] Fee management system
- [ ] Email notifications
- [ ] Advanced reporting with PDF generation

### Version 3.0 (Future)
- [ ] Mobile application (React Native)
- [ ] Real-time collaboration
- [ ] AI-powered insights and predictions
- [ ] Integration with external systems
- [ ] Multi-language support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gangisetty Satvik**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Composable charting library
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable component library

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/student-management-system/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact me directly at your.email@example.com

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 📈 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/student-management-system?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/student-management-system?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/yourusername/student-management-system?style=social)

---

<div align="center">
  <p>Made with ❤️ by Gangisetty Satvik</p>
  <p>© 2024 Student Record Management System. All rights reserved.</p>
</div>
