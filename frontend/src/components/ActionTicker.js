import React, { useMemo } from 'react';
import { Sparkles, CheckCircle2, TimerReset } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

export default function ActionTicker({ students = [], attendanceData = {} }) {
  const actions = useMemo(() => {
    if (!students.length) {
      return [
        { label: 'Import student CSV to unlock action plans', tag: 'Setup', icon: <TimerReset size={14} /> }
      ];
    }

    const failing = students.filter((s) => s.passStatus === 'Fail');
    const lowAttendance = students.filter((s) => getAttendancePct(attendanceData, s._id) < 70);
    const trending = students
      .slice()
      .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
      .slice(0, 3)
      .map((student) => `${student.name} @ ${student.percentage ?? 0}%`);

    return [
      { label: `${trending[0] || 'Top student'} ready for shout-out`, tag: 'Celebrate', icon: <Sparkles size={14} /> },
      { label: failing.length ? `Coach ${failing.length} at-risk student(s)` : 'All students passing · review goals', tag: 'Intervene', icon: <CheckCircle2 size={14} /> },
      { label: lowAttendance.length ? `Boost attendance for ${lowAttendance.length} student(s)` : 'Attendance rhythm holding steady', tag: 'Attendance', icon: <TimerReset size={14} /> }
    ];
  }, [students, attendanceData]);

  return (
    <div className="action-ticker">
      <div className="ticker-label">
        <Sparkles size={16} />
        Instant Actions
      </div>
      <div className="ticker-scroller">
        <div className="ticker-track">
          {actions.concat(actions).map((action, idx) => (
            <span className="ticker-pill" key={`${action.label}-${idx}`}>
              <span className="pill-icon">{action.icon}</span>
              <span className="pill-tag">{action.tag}</span>
              {action.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

