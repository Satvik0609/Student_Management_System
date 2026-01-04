import React, { useMemo } from 'react';
import { Activity, HeartPulse, Zap, Clock } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const icons = {
  energy: <Zap size={18} />,
  pressure: <Activity size={18} />,
  attendance: <HeartPulse size={18} />
};

const meterClasses = ['meter-energy', 'meter-pressure', 'meter-attendance'];

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Autosave live';
  const diff = Date.now() - timestamp;
  if (diff < 60 * 1000) return 'moments ago';
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CohortPulse({ students = [], attendanceData = {}, lastSavedAt }) {
  const metrics = useMemo(() => {
    const total = students.length;
    const passCount = students.filter((s) => s.passStatus === 'Pass').length;
    const avgScore = total
      ? students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / total
      : 0;
    const avgAttendance = total
      ? students.reduce((sum, s) => sum + getAttendancePct(attendanceData, s._id), 0) / total
      : 100;
    const coverage = total
      ? Math.round(
          (students.filter((s) => Object.keys(attendanceData?.[s._id] || {}).length > 0).length / total) * 100
        )
      : 0;
    const energyScore = Math.min(
      100,
      Math.round((avgScore * 0.4 + avgAttendance * 0.4 + (passCount / Math.max(total, 1)) * 100 * 0.2))
    );
    const pressureLevel = Math.min(
      100,
      Math.round(((total - passCount) / Math.max(total, 1)) * 130)
    );
    const attendanceRhythm = Math.round((avgAttendance + coverage) / 2);

    return {
      energyScore,
      pressureLevel,
      attendanceRhythm,
      coverage,
      lastSaved: formatRelativeTime(lastSavedAt)
    };
  }, [students, attendanceData, lastSavedAt]);

  return (
    <div className="cohort-pulse">
      <div className="cohort-pulse__header">
        <div>
          <p className="section-eyebrow mb-1">Cohort pulse</p>
          <h3>Live momentum radar</h3>
        </div>
        <span className="pulse-sync">
          <Clock size={14} />
          Sync {metrics.lastSaved}
        </span>
      </div>
      <div className="pulse-grid">
        {[
          { label: 'Energy score', value: metrics.energyScore, detail: 'Blended of marks + attendance', icon: icons.energy, meter: meterClasses[0] },
          { label: 'Pressure level', value: metrics.pressureLevel, detail: 'Lower is better; watch at-risk', icon: icons.pressure, meter: meterClasses[1] },
          { label: 'Attendance rhythm', value: metrics.attendanceRhythm, detail: `${metrics.coverage}% of students tracked`, icon: icons.attendance, meter: meterClasses[2] }
        ].map((item) => (
          <article key={item.label} className="pulse-card">
            <div className="pulse-card__title">
              <span className="pulse-icon">{item.icon}</span>
              <div>
                <p>{item.label}</p>
                <small>{item.detail}</small>
              </div>
            </div>
            <p className="pulse-value">{item.value}%</p>
            <div className={`pulse-meter ${item.meter}`}>
              <span style={{ width: `${item.value}%` }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

