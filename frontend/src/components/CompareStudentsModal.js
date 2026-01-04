import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const SUBJECT_KEYS = [
  { key: 'mathematics', label: 'Maths' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'english', label: 'English' },
  { key: 'computerScience', label: 'CS' }
];

const COLORS = ['#7c3aed', '#0ea5e9', '#f97316', '#22c55e'];

const CompareStudentsModal = ({ open, onClose, students = [] }) => {
  const data = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return [];
    return SUBJECT_KEYS.map(({ key, label }) => {
      const point = { subject: label };
      students.forEach((student) => {
        point[student.name] = student.subjects?.[key] ?? 0;
      });
      return point;
    });
  }, [students]);

  const meta = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return [];
    return students.map((s) => ({
      name: s.name || 'Unknown',
      grade: s.grade || '-',
      percentage: s.percentage ?? 0,
      attendance: s.attendancePct ?? 0
    }));
  }, [students]);

  if (!open) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Compare Students</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {students.length < 2 ? (
              <p className="text-muted">Select at least two students to compare.</p>
            ) : (
              <>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {meta.map((m, idx) => (
                    <div key={m.name} className="flex-grow-1 p-3 rounded border" style={{ minWidth: 160 }}>
                      <div className="fw-semibold">{m.name}</div>
                      <div className="small text-muted">Grade {m.grade}</div>
                      <div className="small">Score: {m.percentage}%</div>
                      <div className="small">Attendance: {m.attendance}%</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      {students.map((student, idx) => (
                        <Radar
                          key={student._id}
                          name={student.name}
                          dataKey={student.name}
                          stroke={COLORS[idx % COLORS.length]}
                          fill={COLORS[idx % COLORS.length]}
                          fillOpacity={0.3}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CompareStudentsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  students: PropTypes.array.isRequired
};

export default CompareStudentsModal;


