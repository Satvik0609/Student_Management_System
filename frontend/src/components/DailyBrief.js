import React, { useMemo } from 'react';
import { Flame, ShieldAlert, Compass, TrendingUp } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const icons = {
  highlight: <Flame size={18} />,
  watch: <ShieldAlert size={18} />,
  focus: <Compass size={18} />
};

function formatPercent(value) {
  if (Number.isNaN(value) || value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(1)}%`;
}

export default function DailyBrief({ students = [], attendanceData = {} }) {
  const summary = useMemo(() => {
    if (!students.length) {
      return {
        highlight: { title: 'Add student data', detail: 'Stories will appear once students are added.', delta: null },
        watch: { title: 'Waiting for signals', detail: 'Risk alerts need active records.', delta: null },
        focus: { title: 'Goal alignment', detail: 'Use the Goal tab after importing students.', delta: null }
      };
    }

    const sorted = students.slice().sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
    const topStudent = sorted[0];
    const failed = students.filter((s) => s.passStatus === 'Fail');
    const avgAttendance = students.reduce((sum, s) => sum + getAttendancePct(attendanceData, s._id), 0) / students.length;
    const lowAttendance = students.filter((s) => getAttendancePct(attendanceData, s._id) < 70);

    const topDept = students.reduce((acc, student) => {
      if (!student.department) return acc;
      acc[student.department] = acc[student.department] || { count: 0, avg: 0 };
      acc[student.department].count += 1;
      acc[student.department].avg += student.percentage ?? 0;
      return acc;
    }, {});

    const deptMomentum = Object.entries(topDept)
      .map(([name, stats]) => ({
        name,
        avg: stats.count ? stats.avg / stats.count : 0
      }))
      .sort((a, b) => b.avg - a.avg)[0];

    return {
      highlight: {
        title: `${topStudent?.name || 'Top performer'} is leading`,
        detail: `${topStudent?.department || 'Unknown dept'} · ${formatPercent(topStudent?.percentage || 0)} score · rank #1`,
        delta: `${failed.length ? failed.length : 'Zero'} students currently failing`
      },
      watch: {
        title: `${failed.length || 0} students on watch`,
        detail: failed.length ? 'Open Alerts to trigger interventions.' : 'No high-risk students detected.',
        delta: lowAttendance.length ? `${lowAttendance.length} with <70% attendance` : 'Attendance looks steady'
      },
      focus: {
        title: deptMomentum ? `${deptMomentum.name} is trending up` : 'Gather more departmental data',
        detail: deptMomentum ? `${formatPercent(deptMomentum.avg)} average score this week.` : 'Import more data to calculate momentum.',
        delta: `Avg attendance ${formatPercent(avgAttendance)}`
      }
    };
  }, [students, attendanceData]);

  return (
    <div className="daily-brief">
      <header>
        <p className="section-eyebrow mb-1">Daily brief</p>
        <h3>Story-driven summary</h3>
      </header>
      <div className="daily-brief__grid">
        {[
          { id: 'highlight', tone: 'positive' },
          { id: 'watch', tone: 'alert' },
          { id: 'focus', tone: 'info' }
        ].map(({ id, tone }) => {
          const card = summary[id];
          return (
            <article key={id} className={`daily-brief__card is-${tone}`}>
              <div className="card-title">
                <span className="icon">{icons[id]}</span>
                <div>
                  <p>{card.title}</p>
                  <small>{card.detail}</small>
                </div>
              </div>
              {card.delta && (
                <div className="card-delta">
                  <TrendingUp size={14} />
                  <span>{card.delta}</span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

