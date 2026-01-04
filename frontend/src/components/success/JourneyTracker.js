import React, { useMemo } from 'react';
import { MapPinned, Flag, CheckCircle2 } from 'lucide-react';
import { getAttendancePct } from '../../utils/attendance';

const milestones = [
  { id: 'foundation', label: 'Foundations', weight: 0.3 },
  { id: 'portfolio', label: 'Portfolio build', weight: 0.35 },
  { id: 'career', label: 'Career launch', weight: 0.35 }
];

export default function JourneyTracker({ students = [], attendanceData = {} }) {
  const journeys = useMemo(() => {
    if (!students.length) return [];
    return students.slice(0, 4).map((student) => {
      const attendance = getAttendancePct(attendanceData, student._id);
      const progress = milestones.map((milestone, idx) => {
        const base = student.percentage ?? 0;
        const adjusted = Math.min(100, Math.round((base * milestone.weight) + (attendance * 0.2) + idx * 5));
        return { ...milestone, value: adjusted };
      });
      const avg = Math.round(progress.reduce((sum, step) => sum + step.value, 0) / progress.length);
      return { student, progress, avg };
    });
  }, [students, attendanceData]);

  return (
    <section className="success-card journey-tracker">
      <header>
        <p className="section-eyebrow mb-1">Journey tracker</p>
        <h3>Milestone progress</h3>
        <span className="chip tone-info">
          <Flag size={12} />
          {journeys.length ? 'Active journeys' : 'Need student data'}
        </span>
      </header>

      {journeys.length === 0 ? (
        <p className="empty-state">Enroll students to start tracking individual milestones.</p>
      ) : (
        <div className="journey-list">
          {journeys.map(({ student, progress, avg }) => (
            <article key={student._id || student.name}>
              <div className="journey-header">
                <div>
                  <p>{student.name}</p>
                  <small>{student.department || 'General Studies'}</small>
                </div>
                <span className="journey-score">
                  <CheckCircle2 size={14} />
                  {avg}%
                </span>
              </div>
              <ul>
                {progress.map((step) => (
                  <li key={step.id}>
                    <span>{step.label}</span>
                    <div className="progress-bar">
                      <span style={{ width: `${step.value}%` }} />
                    </div>
                    <strong>{step.value}%</strong>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

