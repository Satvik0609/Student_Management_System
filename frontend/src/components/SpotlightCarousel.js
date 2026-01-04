import React, { useEffect, useMemo, useState } from 'react';
import { Award, ChevronLeft, ChevronRight, Star, ArrowUpRight } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

export default function SpotlightCarousel({ students = [], attendanceData = {}, onSelect }) {
  const topStudents = useMemo(() => {
    return students
      .slice()
      .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
      .slice(0, 5)
      .map((student, idx) => ({
        ...student,
        rank: idx + 1,
        attendancePct: getAttendancePct(attendanceData, student._id)
      }));
  }, [students, attendanceData]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [topStudents.length]);

  useEffect(() => {
    if (topStudents.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % topStudents.length);
    }, 4500);
    return () => clearInterval(id);
  }, [topStudents.length]);

  const hasData = topStudents.length > 0;
  const active = hasData ? topStudents[index] : null;

  const changeSlide = (direction) => {
    if (!hasData) return;
    setIndex((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? topStudents.length - 1 : prev - 1;
      }
      return (prev + 1) % topStudents.length;
    });
  };

  return (
    <div className="spotlight-carousel">
      <div className="spotlight-header">
        <div>
          <p className="section-eyebrow mb-1">Spotlight</p>
          <h3>Momentum stories</h3>
        </div>
        <div className="spotlight-nav">
          <button type="button" onClick={() => changeSlide('prev')} disabled={!hasData}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => changeSlide('next')} disabled={!hasData}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="spotlight-empty">
          <Star size={24} />
          <p>Add students to unlock live spotlights.</p>
        </div>
      ) : (
        <div className="spotlight-card">
          <div className="spotlight-rank">
            <Award size={18} />
            #{active.rank}
          </div>
          <h4>{active.name}</h4>
          <p className="spotlight-meta">
            {active.department} · {active.grade || 'NA'} grade
          </p>
          <div className="spotlight-stats">
            <div>
              <span>Score</span>
              <strong>{active.percentage ?? 0}%</strong>
            </div>
            <div>
              <span>Attendance</span>
              <strong>{active.attendancePct}%</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className={active.passStatus === 'Pass' ? 'text-success' : 'text-danger'}>
                {active.passStatus || 'NA'}
              </strong>
            </div>
          </div>
          <button
            type="button"
            className="spotlight-cta"
            onClick={() => onSelect?.(active)}
          >
            View profile
            <ArrowUpRight size={16} />
          </button>
          <p className="spotlight-caption">
            Auto-cycling through top {topStudents.length} achiever{topStudents.length > 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}

