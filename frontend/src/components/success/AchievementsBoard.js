import React, { useMemo } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { getAttendancePct } from '../../utils/attendance';

export default function AchievementsBoard({ students = [], attendanceData = {} }) {
  const badges = useMemo(() => {
    if (!students.length) return [];
    const sortedByScore = students.slice().sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
    const topPerformers = sortedByScore.slice(0, 3).map((student) => student.name);
    const attendanceHeroes = students
      .filter((student) => getAttendancePct(attendanceData, student._id) >= 95)
      .map((student) => student.name);
    const comebackCrew = students
      .filter((student) => (student.percentage ?? 0) >= 65 && (student.percentage ?? 0) <= 75 && student.passStatus === 'Pass')
      .map((student) => student.name);

    return [
      { title: 'Summit Scholars', subtitle: 'Top performers this term', recipients: topPerformers },
      { title: 'Attendance Legends', subtitle: '95%+ presence streaks', recipients: attendanceHeroes },
      { title: 'Momentum Builders', subtitle: 'From average to thriving', recipients: comebackCrew }
    ];
  }, [students, attendanceData]);

  return (
    <section className="success-card achievements-board">
      <header>
        <p className="section-eyebrow mb-1">Achievements</p>
        <h3>Badges & shout-outs</h3>
      </header>
      {badges.length === 0 || badges.every((badge) => badge.recipients.length === 0) ? (
        <p className="empty-state">Keep collecting data to unlock the first batch of achievements.</p>
      ) : (
        <div className="badge-grid">
          {badges.map((badge) => (
            <article key={badge.title}>
              <div className="badge-icon">
                {badge.title === 'Summit Scholars' ? <Trophy size={18} /> : <Medal size={18} />}
              </div>
              <div>
                <p>{badge.title}</p>
                <small>{badge.subtitle}</small>
              </div>
              <ul>
                {badge.recipients.length ? (
                  badge.recipients.map((recipient) => <li key={recipient}>{recipient}</li>)
                ) : (
                  <li className="muted">More data needed</li>
                )}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

