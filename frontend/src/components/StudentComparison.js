import React, { useState, useMemo } from 'react';
import { Users, X, TrendingUp, TrendingDown, Minus, Award, AlertTriangle, BookOpen, Calendar, BarChart3 } from 'lucide-react';

export default function StudentComparison({ students = [] }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [compareMode, setCompareMode] = useState('side-by-side'); // side-by-side, matrix

  const selectedStudents = useMemo(() => {
    return students.filter(s => selectedIds.has(s._id));
  }, [students, selectedIds]);

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 5) { // Limit to 5 students
        newSet.add(id);
      }
    }
    setSelectedIds(newSet);
  };

  const comparisonData = useMemo(() => {
    if (selectedStudents.length < 2) return null;

    const data = {
      average: {
        percentage: selectedStudents.reduce((sum, s) => sum + (s.percentage || 0), 0) / selectedStudents.length,
        attendance: selectedStudents.reduce((sum, s) => sum + (s.attendance || 0), 0) / selectedStudents.length
      },
      highest: {
        percentage: Math.max(...selectedStudents.map(s => s.percentage || 0)),
        attendance: Math.max(...selectedStudents.map(s => s.attendance || 0))
      },
      lowest: {
        percentage: Math.min(...selectedStudents.map(s => s.percentage || 0)),
        attendance: Math.min(...selectedStudents.map(s => s.attendance || 0))
      },
      passRate: (selectedStudents.filter(s => s.passStatus === 'Pass').length / selectedStudents.length) * 100
    };

    return data;
  }, [selectedStudents]);

  const getTrendIcon = (value, avg) => {
    if (value > avg) return <TrendingUp size={16} className="trend-up" />;
    if (value < avg) return <TrendingDown size={16} className="trend-down" />;
    return <Minus size={16} className="trend-neutral" />;
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'var(--success)', icon: <Award size={14} /> };
    if (percentage >= 65) return { label: 'Good', color: 'var(--primary)', icon: <TrendingUp size={14} /> };
    if (percentage >= 50) return { label: 'Average', color: 'var(--warning)', icon: <Minus size={14} /> };
    return { label: 'Needs Improvement', color: 'var(--danger)', icon: <AlertTriangle size={14} /> };
  };

  if (selectedStudents.length < 2) {
    return (
      <div className="student-comparison">
        <div className="comparison-header">
          <div className="comparison-title">
            <Users size={24} />
            <h2>Student Comparison Tool</h2>
          </div>
          <p className="comparison-subtitle">Select 2-5 students to compare their performance</p>
        </div>

        <div className="student-selector-grid">
          {students.map(student => (
            <div
              key={student._id}
              className={`student-select-card ${selectedIds.has(student._id) ? 'selected' : ''}`}
              onClick={() => toggleSelect(student._id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(student._id)}
                onChange={() => toggleSelect(student._id)}
                onClick={(e) => e.stopPropagation()}
                disabled={!selectedIds.has(student._id) && selectedIds.size >= 5}
              />
              <div className="student-preview">
                <div className="student-avatar">
                  {student.name?.charAt(0).toUpperCase()}
                </div>
                <div className="student-details">
                  <strong>{student.name}</strong>
                  <small>{student.department}</small>
                  <div className="student-metrics">
                    <span>{student.percentage || 0}%</span>
                    <span className={`status-badge ${student.passStatus?.toLowerCase()}`}>
                      {student.passStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedIds.size > 0 && (
          <div className="selected-count">
            {selectedIds.size} of 5 selected
            <button onClick={() => setSelectedIds(new Set())}>
              <X size={16} />
              Clear
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="student-comparison">
      <div className="comparison-header">
        <div className="comparison-title">
          <Users size={24} />
          <h2>Comparing {selectedStudents.length} Students</h2>
        </div>
        <div className="comparison-controls">
          <select
            value={compareMode}
            onChange={(e) => setCompareMode(e.target.value)}
          >
            <option value="side-by-side">Side by Side</option>
            <option value="matrix">Comparison Matrix</option>
          </select>
          <button className="clear-btn" onClick={() => setSelectedIds(new Set())}>
            <X size={18} />
            Clear Selection
          </button>
        </div>
      </div>

      {comparisonData && (
        <div className="comparison-summary">
          <div className="summary-card">
            <BarChart3 size={20} />
            <div>
              <span className="summary-label">Average Performance</span>
              <span className="summary-value">{comparisonData.average.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="summary-card">
            <Calendar size={20} />
            <div>
              <span className="summary-label">Average Attendance</span>
              <span className="summary-value">{comparisonData.average.attendance.toFixed(1)}%</span>
            </div>
          </div>
          <div className="summary-card">
            <Award size={20} />
            <div>
              <span className="summary-label">Pass Rate</span>
              <span className="summary-value">{comparisonData.passRate.toFixed(0)}%</span>
            </div>
          </div>
          <div className="summary-card">
            <TrendingUp size={20} />
            <div>
              <span className="summary-label">Highest Score</span>
              <span className="summary-value">{comparisonData.highest.percentage}%</span>
            </div>
          </div>
        </div>
      )}

      {compareMode === 'side-by-side' ? (
        <div className="comparison-side-by-side">
          {selectedStudents.map((student, idx) => {
            const badge = getPerformanceBadge(student.percentage || 0);
            return (
              <div key={student._id} className="comparison-card">
                <div className="card-header">
                  <div className="student-header">
                    <div className="student-avatar-large">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{student.name}</h3>
                      <p>{student.department}</p>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => toggleSelect(student._id)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="comparison-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Percentage</span>
                    <div className="metric-value">
                      <span className="value">{student.percentage || 0}%</span>
                      {comparisonData && getTrendIcon(student.percentage || 0, comparisonData.average.percentage)}
                    </div>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Attendance</span>
                    <div className="metric-value">
                      <span className="value">{student.attendance || 0}%</span>
                      {comparisonData && getTrendIcon(student.attendance || 0, comparisonData.average.attendance)}
                    </div>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Status</span>
                    <span className={`status-badge ${student.passStatus?.toLowerCase()}`}>
                      {student.passStatus}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Performance</span>
                    <span className="performance-badge" style={{ color: badge.color }}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="comparison-details">
                  <div className="detail-item">
                    <BookOpen size={16} />
                    <span>Roll: {student.rollNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Email: {student.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="comparison-matrix">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Percentage</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudents.map((student) => {
                const badge = getPerformanceBadge(student.percentage || 0);
                return (
                  <tr key={student._id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar-small">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell">
                        {student.percentage || 0}%
                        {comparisonData && getTrendIcon(student.percentage || 0, comparisonData.average.percentage)}
                      </div>
                    </td>
                    <td>
                      <div className="metric-cell">
                        {student.attendance || 0}%
                        {comparisonData && getTrendIcon(student.attendance || 0, comparisonData.average.attendance)}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${student.passStatus?.toLowerCase()}`}>
                        {student.passStatus}
                      </span>
                    </td>
                    <td>
                      <span className="performance-badge" style={{ color: badge.color }}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </td>
                    <td>{student.department}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

