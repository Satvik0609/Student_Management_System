import jsPDF from 'jspdf';

// Helper to add text with wrapping
const addText = (doc, text, x, y, maxWidth, fontSize = 10, align = 'left') => {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y, { align });
  return y + (lines.length * fontSize * 0.4);
};

// Individual Student Report Card
export const generateIndividualReport = (student, attendancePct = 100) => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('STUDENT REPORT CARD', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
  y += 15;

  // Student Info Section
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Student Information', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  y = addText(doc, `Name: ${student.name || 'N/A'}`, 20, y, 170);
  y = addText(doc, `USN: ${student.usn || 'N/A'}`, 20, y, 170);
  y = addText(doc, `Department: ${student.department || 'N/A'}`, 20, y, 170);
  if (student.email) y = addText(doc, `Email: ${student.email}`, 20, y, 170);
  if (student.phone) y = addText(doc, `Phone: ${student.phone}`, 20, y, 170);
  y += 5;

  // Academic Performance
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Academic Performance', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  // Subjects Table
  const subjects = [
    { name: 'Mathematics', score: student.subjects?.mathematics ?? 0 },
    { name: 'Physics', score: student.subjects?.physics ?? 0 },
    { name: 'Chemistry', score: student.subjects?.chemistry ?? 0 },
    { name: 'English', score: student.subjects?.english ?? 0 },
    { name: 'Computer Science', score: student.subjects?.computerScience ?? 0 }
  ];

  doc.setFont(undefined, 'bold');
  doc.text('Subject', 20, y);
  doc.text('Marks', 80, y);
  doc.text('Grade', 120, y);
  y += 6;

  doc.setFont(undefined, 'normal');
  subjects.forEach((subj) => {
    const grade = subj.score >= 90 ? 'A+' : subj.score >= 80 ? 'A' : subj.score >= 70 ? 'B+' : subj.score >= 60 ? 'B' : subj.score >= 50 ? 'C' : 'F';
    doc.text(subj.name, 20, y);
    doc.text(`${subj.score}/100`, 80, y);
    doc.text(grade, 120, y);
    y += 6;
  });

  y += 5;
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  y = addText(doc, `Total Marks: ${student.totalMarks || 0}/500`, 20, y, 170);
  y = addText(doc, `Percentage: ${student.percentage || 0}%`, 20, y, 170);
  y = addText(doc, `Grade: ${student.grade || 'N/A'}`, 20, y, 170);
  y = addText(doc, `CGPA: ${student.cgpa || 0}`, 20, y, 170);
  y = addText(doc, `Status: ${student.passStatus || 'N/A'}`, 20, y, 170);
  y = addText(doc, `Attendance: ${attendancePct}%`, 20, y, 170);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated report.', 105, pageHeight - 10, { align: 'center' });

  doc.save(`ReportCard_${student.usn || student.name}_${Date.now()}.pdf`);
};

// Class Performance Report
export const generateClassReport = (students) => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('CLASS PERFORMANCE REPORT', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
  y += 15;

  // Statistics
  const total = students.length;
  const avg = total ? students.reduce((sum, s) => sum + (s.percentage || 0), 0) / total : 0;
  const passCount = students.filter((s) => s.passStatus === 'Pass').length;
  const passRate = total ? (passCount / total) * 100 : 0;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Summary Statistics', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  y = addText(doc, `Total Students: ${total}`, 20, y, 170);
  y = addText(doc, `Average Percentage: ${avg.toFixed(2)}%`, 20, y, 170);
  y = addText(doc, `Pass Rate: ${passRate.toFixed(1)}%`, 20, y, 170);
  y = addText(doc, `Passed: ${passCount}`, 20, y, 170);
  y = addText(doc, `Failed: ${total - passCount}`, 20, y, 170);
  y += 10;

  // Grade Distribution
  const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0 };
  students.forEach((s) => {
    const grade = s.grade || 'F';
    if (grades.hasOwnProperty(grade)) grades[grade]++;
  });

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Grade Distribution', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  Object.entries(grades).forEach(([grade, count]) => {
    doc.text(`${grade}: ${count} students`, 20, y);
    y += 6;
  });

  y += 10;

  // Top Performers
  const topPerformers = students.slice().sort((a, b) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 10);
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Top 10 Performers', 20, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Rank', 20, y);
  doc.text('Name', 35, y);
  doc.text('USN', 100, y);
  doc.text('Percentage', 150, y);
  doc.text('Grade', 180, y);
  y += 6;

  doc.setFont(undefined, 'normal');
  topPerformers.forEach((student, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${idx + 1}`, 20, y);
    doc.text(student.name || 'N/A', 35, y);
    doc.text(student.usn || 'N/A', 100, y);
    doc.text(`${student.percentage || 0}%`, 150, y);
    doc.text(student.grade || 'N/A', 180, y);
    y += 6;
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated report.', 105, pageHeight - 10, { align: 'center' });

  doc.save(`ClassPerformanceReport_${Date.now()}.pdf`);
};

// Department-wise Analysis
export const generateDepartmentReport = (students, departments) => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('DEPARTMENT-WISE ANALYSIS', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
  y += 15;

  // Department Statistics
  const deptStats = departments.map((dept) => {
    const deptStudents = students.filter((s) => s.department === dept);
    const count = deptStudents.length;
    const avg = count ? deptStudents.reduce((sum, s) => sum + (s.percentage || 0), 0) / count : 0;
    const passCount = deptStudents.filter((s) => s.passStatus === 'Pass').length;
    const passRate = count ? (passCount / count) * 100 : 0;
    return { dept, count, avg, passCount, passRate };
  });

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Department Comparison', 20, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Department', 20, y);
  doc.text('Students', 80, y);
  doc.text('Avg %', 110, y);
  doc.text('Pass Rate', 140, y);
  doc.text('Passed', 170, y);
  y += 6;

  doc.setFont(undefined, 'normal');
  deptStats.forEach((stat) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(stat.dept, 20, y);
    doc.text(`${stat.count}`, 80, y);
    doc.text(`${stat.avg.toFixed(1)}%`, 110, y);
    doc.text(`${stat.passRate.toFixed(1)}%`, 140, y);
    doc.text(`${stat.passCount}`, 170, y);
    y += 6;
  });

  y += 10;

  // Best Performing Department
  const bestDept = deptStats.reduce((best, current) => 
    current.avg > (best?.avg || 0) ? current : best, null
  );

  if (bestDept) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Best Performing Department', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y = addText(doc, `${bestDept.dept}`, 20, y, 170);
    y = addText(doc, `Average: ${bestDept.avg.toFixed(2)}%`, 20, y, 170);
    y = addText(doc, `Pass Rate: ${bestDept.passRate.toFixed(1)}%`, 20, y, 170);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated report.', 105, pageHeight - 10, { align: 'center' });

  doc.save(`DepartmentAnalysis_${Date.now()}.pdf`);
};

// Custom Report Builder
export const generateCustomReport = (students, selectedKPIs) => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('CUSTOM PERFORMANCE REPORT', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
  y += 15;

  // Calculate all metrics
  const total = students.length;
  const avg = total ? students.reduce((sum, s) => sum + (s.percentage || 0), 0) / total : 0;
  const passCount = students.filter((s) => s.passStatus === 'Pass').length;
  const passRate = total ? (passCount / total) * 100 : 0;
  const failCount = total - passCount;

  // Grade Distribution
  const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0 };
  students.forEach((s) => {
    const grade = s.grade || 'F';
    if (grades.hasOwnProperty(grade)) grades[grade]++;
  });

  // Department Breakdown
  const deptMap = new Map();
  students.forEach((s) => {
    const dept = s.department || 'Unknown';
    const entry = deptMap.get(dept) || { count: 0, sum: 0 };
    entry.count += 1;
    entry.sum += s.percentage || 0;
    deptMap.set(dept, entry);
  });

  // Display selected KPIs
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Report Metrics', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  if (selectedKPIs.includes('Total Students')) {
    y = addText(doc, `Total Students: ${total}`, 20, y, 170);
  }
  if (selectedKPIs.includes('Average Percentage')) {
    y = addText(doc, `Average Percentage: ${avg.toFixed(2)}%`, 20, y, 170);
  }
  if (selectedKPIs.includes('Pass Rate')) {
    y = addText(doc, `Pass Rate: ${passRate.toFixed(1)}%`, 20, y, 170);
  }
  if (selectedKPIs.includes('Pass Count')) {
    y = addText(doc, `Passed: ${passCount}`, 20, y, 170);
  }
  if (selectedKPIs.includes('Fail Count')) {
    y = addText(doc, `Failed: ${failCount}`, 20, y, 170);
  }

  if (selectedKPIs.includes('Grade Distribution')) {
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Grade Distribution', 20, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    Object.entries(grades).forEach(([grade, count]) => {
      doc.text(`${grade}: ${count} students`, 20, y);
      y += 6;
    });
  }

  if (selectedKPIs.includes('Top Performers')) {
    y += 5;
    const topPerformers = students.slice().sort((a, b) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 10);
    doc.setFont(undefined, 'bold');
    doc.text('Top 10 Performers', 20, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    topPerformers.forEach((student, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${idx + 1}. ${student.name || 'N/A'} - ${student.percentage || 0}%`, 20, y);
      y += 6;
    });
  }

  if (selectedKPIs.includes('Department Breakdown')) {
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Department Breakdown', 20, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    Array.from(deptMap.entries()).forEach(([dept, { count, sum }]) => {
      const deptAvg = count ? (sum / count) : 0;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${dept}: ${count} students, Avg: ${deptAvg.toFixed(1)}%`, 20, y);
      y += 6;
    });
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated report.', 105, pageHeight - 10, { align: 'center' });

  doc.save(`CustomReport_${Date.now()}.pdf`);
};

