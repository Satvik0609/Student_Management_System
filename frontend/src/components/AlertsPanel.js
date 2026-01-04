import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Bell, Mail, Trophy } from 'lucide-react';

const AlertsPanel = ({ students = [], onExportTemplates }) => {
  const lowPerformance = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter((s) => (s.percentage ?? 0) < 60);
  }, [students]);
  const achievements = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter((s) => (s.percentage ?? 0) >= 90);
  }, [students]);
  const missingData = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter((s) => !s.email || !s.phone);
  }, [students]);

  const templates = {
    lowPerformance,
    achievements,
    missingData
  };

  return (
    <div className="alerts-panel">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-warning mb-2">
                <AlertTriangle size={18} />
                Low performance alerts
              </div>
              <p className="text-muted small">Flag students scoring below 60%.</p>
              <ul className="list-unstyled small mb-0">
                {lowPerformance.length === 0 && <li className="text-muted">No alerts 🎉</li>}
                {lowPerformance.map((student) => (
                  <li key={student._id}>{student.name} — {student.percentage}%</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-success mb-2">
                <Trophy size={18} />
                Achievement milestones
              </div>
              <p className="text-muted small">Celebrate students scoring 90%+.</p>
              <ul className="list-unstyled small mb-0">
                {achievements.length === 0 && <li className="text-muted">No milestones yet.</li>}
                {achievements.map((student) => (
                  <li key={student._id}>{student.name} — {student.percentage}%</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-primary mb-2">
                <Mail size={18} />
                Missing data reminders
              </div>
              <p className="text-muted small">Students missing email/phone details.</p>
              <ul className="list-unstyled small mb-0">
                {missingData.length === 0 && <li className="text-muted">All contact data is present.</li>}
                {missingData.map((student) => (
                  <li key={student._id}>{student.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <Bell size={20} />
            <div>
              <div className="fw-semibold">Automated alert templates</div>
              <div className="text-muted small">Download JSON templates for email integrations.</div>
            </div>
          </div>
          <button className="btn btn-outline-primary" onClick={() => onExportTemplates(templates)}>Export JSON</button>
        </div>
      </div>
    </div>
  );
};

AlertsPanel.propTypes = {
  students: PropTypes.array.isRequired,
  onExportTemplates: PropTypes.func.isRequired
};

export default AlertsPanel;


