import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];

const generateHistory = (student) => {
  if (Array.isArray(student.performanceHistory) && student.performanceHistory.length) {
    return student.performanceHistory;
  }
  const base = student.percentage ?? 70;
  return SEMESTERS.map((label, idx) => {
    const variance = (Math.sin(idx) * 5) + Math.random() * 4;
    return { semester: label, score: Math.max(40, Math.min(100, base - 10 + idx * 2 + variance)) };
  });
};

const PerformanceTrends = ({ students = [] }) => {
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(students) && students.length > 0 ? students.slice(0, 2).map((s) => s._id) : []
  );

  const chartData = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return [];
    const dataset = SEMESTERS.map((semester) => ({ semester }));
    students.forEach((student) => {
      if (!student || !selectedIds.includes(student._id)) return;
      const studentName = student.name || `Student ${student._id}`;
      generateHistory(student).forEach((entry) => {
        const row = dataset.find((d) => d.semester === entry.semester);
        if (row) row[studentName] = entry.score;
      });
    });
    return dataset;
  }, [students, selectedIds]);

  const atRisk = useMemo(() => students.filter((s) => (s.percentage ?? 0) < 55), [students]);

  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        const [, ...rest] = prev;
        return [...rest, id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="performance-panel">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-uppercase text-muted small">Select students</div>
              <p className="text-muted small mb-2">Pick up to 3 students to compare trends.</p>
              <div className="list-group performance-selector">
                {students.map((student) => (
                  <button
                    type="button"
                    key={student._id}
                    className={`list-group-item list-group-item-action ${selectedIds.includes(student._id) ? 'active' : ''}`}
                    onClick={() => handleSelect(student._id)}
                  >
                    <div className="fw-semibold">{student.name}</div>
                    <small className="text-muted">Current {student.percentage ?? 0}%</small>
                  </button>
                ))}
              </div>
              {atRisk.length > 0 && (
                <div className="alert alert-danger mt-3 mb-0">
                  <strong>At-risk students:</strong>
                  <ul className="mb-0">
                    {atRisk.map((student) => (
                      <li key={student._id}>{student.name} ({student.percentage ?? 0}%)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-uppercase text-muted small">Performance over time</div>
              <div style={{ width: '100%', height: 360 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    {students.filter((s) => selectedIds.includes(s._id)).map((student, idx) => (
                      <Line
                        key={student._id}
                        type="monotone"
                        dataKey={student.name}
                        stroke={['#6366f1', '#10b981', '#f97316'][idx % 3]}
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PerformanceTrends.propTypes = {
  students: PropTypes.array.isRequired
};

export default PerformanceTrends;


