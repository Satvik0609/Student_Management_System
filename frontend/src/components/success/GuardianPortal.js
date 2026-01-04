import React, { useMemo } from 'react';
import { Send, PhoneCall } from 'lucide-react';
import { getAttendancePct } from '../../utils/attendance';

export default function GuardianPortal({ students = [], attendanceData = {}, onShare }) {
  const digest = useMemo(() => {
    if (!students.length) return [];
    return students.slice(0, 3).map((student) => ({
      id: student._id || student.name,
      name: student.name,
      guardian: student.guardian || `${student.name?.split(' ')[0] || 'Guardian'} Family`,
      attendance: getAttendancePct(attendanceData, student._id),
      alerts: student.passStatus === 'Fail' ? 'Academic coaching recommended' : 'On track'
    }));
  }, [students, attendanceData]);

  const shareDigest = () => {
    if (!onShare) return;
    onShare('guardian-digest.json', {
      generatedAt: new Date().toISOString(),
      digest
    });
  };

  return (
    <section className="success-card guardian-portal">
      <header>
        <p className="section-eyebrow mb-1">Guardian portal</p>
        <h3>Family-ready summaries</h3>
      </header>
      {digest.length === 0 ? (
        <p className="empty-state">Once you add students, their guardian digests will appear here.</p>
      ) : (
        <>
          <ul className="guardian-list">
            {digest.map((entry) => (
              <li key={entry.id}>
                <div>
                  <p>{entry.guardian}</p>
                  <small>{entry.name}</small>
                </div>
                <span className={entry.alerts === 'On track' ? 'chip tone-success' : 'chip tone-alert'}>
                  {entry.alerts}
                </span>
                <span className="attendance-pill">{entry.attendance}% attendance</span>
                <button type="button" title="Call guardian">
                  <PhoneCall size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="guardian-actions">
            <button type="button" onClick={shareDigest}>
              <Send size={16} />
              Share digest
            </button>
          </div>
        </>
      )}
    </section>
  );
}

