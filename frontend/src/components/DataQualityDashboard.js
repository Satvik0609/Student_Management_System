import React, { useMemo } from 'react';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Database, Shield } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 75,
  fair: 60,
  poor: 0
};

export default function DataQualityDashboard({ students = [], attendanceData = {} }) {
  const qualityMetrics = useMemo(() => {
    if (!students.length) {
      return {
        overall: 0,
        completeness: 0,
        accuracy: 0,
        consistency: 0,
        issues: [],
        score: 'N/A'
      };
    }

    const issues = [];
    let completenessScore = 0;
    let accuracyScore = 0;
    let consistencyScore = 0;

    // Completeness checks
    const requiredFields = ['name', 'usn', 'department', 'email', 'phone', 'percentage'];
    let completeRecords = 0;

    students.forEach((student) => {
      const missingFields = requiredFields.filter((field) => {
        const value = student[field];
        return value === null || value === undefined || value === '';
      });

      if (missingFields.length === 0) {
        completeRecords++;
      } else {
        issues.push({
          type: 'incomplete',
          student: student.name || student.usn || 'Unknown',
          field: missingFields[0],
          severity: 'medium',
          message: `Missing ${missingFields[0]}`
        });
      }
    });

    completenessScore = (completeRecords / students.length) * 100;

    // Accuracy checks
    let validRecords = 0;
    students.forEach((student) => {
      const pct = student.percentage ?? 0;
      const isValid = pct >= 0 && pct <= 100;
      const hasValidEmail = student.email && student.email.includes('@');
      const hasValidPhone = !student.phone || /^[\d\s\-\+\(\)]+$/.test(student.phone);

      if (isValid && hasValidEmail && hasValidPhone) {
        validRecords++;
      } else {
        if (!isValid) {
          issues.push({
            type: 'invalid',
            student: student.name || student.usn || 'Unknown',
            field: 'percentage',
            severity: 'high',
            message: `Invalid percentage: ${pct}%`
          });
        }
        if (!hasValidEmail && student.email) {
          issues.push({
            type: 'invalid',
            student: student.name || student.usn || 'Unknown',
            field: 'email',
            severity: 'medium',
            message: `Invalid email format: ${student.email}`
          });
        }
      }
    });

    accuracyScore = (validRecords / students.length) * 100;

    // Consistency checks
    let consistentRecords = 0;
    students.forEach((student) => {
      const pct = student.percentage ?? 0;
      const grade = student.grade;
      const passStatus = student.passStatus;

      // Check grade consistency
      let expectedGrade = 'F';
      if (pct >= 90) expectedGrade = 'S';
      else if (pct >= 80) expectedGrade = 'A';
      else if (pct >= 70) expectedGrade = 'B';
      else if (pct >= 60) expectedGrade = 'C';
      else if (pct >= 50) expectedGrade = 'D';

      // Check pass status consistency
      const expectedPassStatus = pct >= 60 ? 'Pass' : 'Fail';

      const isConsistent =
        (!grade || grade === expectedGrade) && (!passStatus || passStatus === expectedPassStatus);

      if (isConsistent) {
        consistentRecords++;
      } else {
        issues.push({
          type: 'inconsistent',
          student: student.name || student.usn || 'Unknown',
          field: grade !== expectedGrade ? 'grade' : 'passStatus',
          severity: 'low',
          message: `Mismatch: ${grade || 'N/A'} grade with ${pct}% score`
        });
      }
    });

    consistencyScore = (consistentRecords / students.length) * 100;

    // Attendance coverage
    const studentsWithAttendance = students.filter((s) => {
      const record = attendanceData?.[s._id] || {};
      return Object.keys(record).length > 0;
    });
    const attendanceCoverage = (studentsWithAttendance.length / students.length) * 100;

    const overall = (completenessScore + accuracyScore + consistencyScore) / 3;

    let score = 'Poor';
    if (overall >= QUALITY_THRESHOLDS.excellent) score = 'Excellent';
    else if (overall >= QUALITY_THRESHOLDS.good) score = 'Good';
    else if (overall >= QUALITY_THRESHOLDS.fair) score = 'Fair';

    return {
      overall: Math.round(overall),
      completeness: Math.round(completenessScore),
      accuracy: Math.round(accuracyScore),
      consistency: Math.round(consistencyScore),
      attendanceCoverage: Math.round(attendanceCoverage),
      issues: issues.slice(0, 10), // Top 10 issues
      score,
      totalIssues: issues.length
    };
  }, [students, attendanceData]);

  const getScoreColor = (score) => {
    if (score >= QUALITY_THRESHOLDS.excellent) return 'emerald';
    if (score >= QUALITY_THRESHOLDS.good) return 'blue';
    if (score >= QUALITY_THRESHOLDS.fair) return 'amber';
    return 'rose';
  };

  return (
    <div className="data-quality-dashboard">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Data Quality Dashboard</p>
          <h3>Automated validation & scoring</h3>
        </div>
        <div className={`quality-badge is-${getScoreColor(qualityMetrics.overall)}`}>
          <Shield size={16} />
          {qualityMetrics.score} Quality
        </div>
      </header>

      <div className="quality-overview">
        <div className="quality-score-card">
          <div className="score-value">{qualityMetrics.overall}%</div>
          <div className="score-label">Overall Quality</div>
          <div className={`score-indicator is-${getScoreColor(qualityMetrics.overall)}`} />
        </div>

        <div className="quality-metrics">
          <div className="metric-card">
            <div className="metric-header">
              <Database size={18} />
              <span>Completeness</span>
            </div>
            <div className="metric-value">{qualityMetrics.completeness}%</div>
            <div className="metric-bar">
              <div
                className={`metric-fill is-${getScoreColor(qualityMetrics.completeness)}`}
                style={{ width: `${qualityMetrics.completeness}%` }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <CheckCircle2 size={18} />
              <span>Accuracy</span>
            </div>
            <div className="metric-value">{qualityMetrics.accuracy}%</div>
            <div className="metric-bar">
              <div
                className={`metric-fill is-${getScoreColor(qualityMetrics.accuracy)}`}
                style={{ width: `${qualityMetrics.accuracy}%` }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <TrendingUp size={18} />
              <span>Consistency</span>
            </div>
            <div className="metric-value">{qualityMetrics.consistency}%</div>
            <div className="metric-bar">
              <div
                className={`metric-fill is-${getScoreColor(qualityMetrics.consistency)}`}
                style={{ width: `${qualityMetrics.consistency}%` }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <CheckCircle2 size={18} />
              <span>Attendance Coverage</span>
            </div>
            <div className="metric-value">{qualityMetrics.attendanceCoverage}%</div>
            <div className="metric-bar">
              <div
                className={`metric-fill is-${getScoreColor(qualityMetrics.attendanceCoverage)}`}
                style={{ width: `${qualityMetrics.attendanceCoverage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {qualityMetrics.totalIssues > 0 && (
        <div className="quality-issues">
          <div className="issues-header">
            <AlertCircle size={18} />
            <span>
              {qualityMetrics.totalIssues} Issue{qualityMetrics.totalIssues > 1 ? 's' : ''} Detected
            </span>
          </div>
          <div className="issues-list">
            {qualityMetrics.issues.map((issue, idx) => (
              <div key={idx} className={`issue-item is-${issue.severity}`}>
                <div className="issue-icon">
                  {issue.severity === 'high' && <XCircle size={16} />}
                  {issue.severity === 'medium' && <AlertCircle size={16} />}
                  {issue.severity === 'low' && <CheckCircle2 size={16} />}
                </div>
                <div className="issue-content">
                  <div className="issue-title">{issue.message}</div>
                  <div className="issue-meta">
                    {issue.student} · {issue.field}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {qualityMetrics.totalIssues === 0 && students.length > 0 && (
        <div className="quality-success">
          <CheckCircle2 size={32} />
          <p>Excellent! All data quality checks passed.</p>
        </div>
      )}
    </div>
  );
}

