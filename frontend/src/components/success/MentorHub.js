import React, { useMemo } from 'react';
import { Users, MessageSquare, BookOpen } from 'lucide-react';
import { getAttendancePct } from '../../utils/attendance';

const mentorRoster = [
  { name: 'Dr. Aanya Patel', specialty: 'AI & Analytics', slots: 5 },
  { name: 'Prof. Liam Chen', specialty: 'Systems & Cloud', slots: 4 },
  { name: 'Dr. Rose Mbaye', specialty: 'Humanities Integration', slots: 6 },
  { name: 'Coach Mateo Silva', specialty: 'Career Design', slots: 8 }
];

export default function MentorHub({ students = [], attendanceData = {} }) {
  const matchups = useMemo(() => {
    if (!students.length) return [];
    return students.slice(0, 6).map((student, idx) => {
      const mentor = mentorRoster[idx % mentorRoster.length];
      return {
        mentor,
        student,
        attendance: getAttendancePct(attendanceData, student._id)
      };
    });
  }, [students, attendanceData]);

  return (
    <section className="success-card mentor-hub">
      <header>
        <p className="section-eyebrow mb-1">Mentor Hub</p>
        <h3>Advisor pairings</h3>
        <span className="chip">Live cohorts {students.length || 0}</span>
      </header>
      {matchups.length === 0 ? (
        <p className="empty-state">Add students to auto-generate mentor matches.</p>
      ) : (
        <ul className="mentor-list">
          {matchups.map(({ mentor, student, attendance }) => (
            <li key={student._id || student.name}>
              <div className="mentor-meta">
                <div className="mentor-avatar">
                  <Users size={16} />
                </div>
                <div>
                  <p className="label">{mentor.name}</p>
                  <small>{mentor.specialty}</small>
                </div>
              </div>
              <div className="pairing">
                <p>{student.name}</p>
                <small>{student.department || 'General'} · {attendance}% attendance</small>
              </div>
              <div className="mentor-actions">
                <button type="button" title="Add note">
                  <MessageSquare size={16} />
                </button>
                <button type="button" title="Curriculum plan">
                  <BookOpen size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

