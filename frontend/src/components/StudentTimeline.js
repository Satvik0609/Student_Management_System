import React, { useMemo, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Award, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const EVENT_TYPES = {
  created: { icon: <Calendar size={16} />, color: 'blue', label: 'Added' },
  improved: { icon: <TrendingUp size={16} />, color: 'green', label: 'Improved' },
  declined: { icon: <TrendingDown size={16} />, color: 'red', label: 'Declined' },
  milestone: { icon: <Award size={16} />, color: 'amber', label: 'Milestone' },
  alert: { icon: <AlertTriangle size={16} />, color: 'rose', label: 'Alert' }
};

export default function StudentTimeline({ students = [], attendanceData = {}, onSelectStudent }) {
  const [filter, setFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const timeline = useMemo(() => {
    if (!students.length) return [];

    const events = [];

    students.forEach((student) => {
      const pct = student.percentage ?? 0;
      const attendancePct = getAttendancePct(attendanceData, student._id);
      const createdAt = student.createdAt ? new Date(student.createdAt) : new Date();

      // Creation event
      events.push({
        id: `${student._id}-created`,
        studentId: student._id,
        studentName: student.name,
        type: 'created',
        timestamp: createdAt,
        description: `${student.name} was added to the system`,
        metadata: { department: student.department, initialScore: pct }
      });

      // Performance milestones
      if (pct >= 90) {
        events.push({
          id: `${student._id}-milestone-90`,
          studentId: student._id,
          studentName: student.name,
          type: 'milestone',
          timestamp: createdAt,
          description: `${student.name} achieved 90%+ score`,
          metadata: { score: pct }
        });
      }

      if (pct < 60) {
        events.push({
          id: `${student._id}-alert-low`,
          studentId: student._id,
          studentName: student.name,
          type: 'alert',
          timestamp: createdAt,
          description: `${student.name} is below passing threshold`,
          metadata: { score: pct }
        });
      }

      // Attendance alerts
      if (attendancePct < 70) {
        events.push({
          id: `${student._id}-alert-attendance`,
          studentId: student._id,
          studentName: student.name,
          type: 'alert',
          timestamp: createdAt,
          description: `${student.name} has low attendance (${attendancePct}%)`,
          metadata: { attendance: attendancePct }
        });
      }

      // Grade-based events
      if (student.grade === 'A' || student.grade === 'S') {
        events.push({
          id: `${student._id}-milestone-grade`,
          studentId: student._id,
          studentName: student.name,
          type: 'milestone',
          timestamp: createdAt,
          description: `${student.name} earned ${student.grade} grade`,
          metadata: { grade: student.grade, score: pct }
        });
      }
    });

    // Sort by timestamp (newest first)
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [students, attendanceData]);

  const filteredTimeline = useMemo(() => {
    if (filter === 'all') return timeline;
    if (filter === 'student' && selectedStudent) {
      return timeline.filter((e) => e.studentId === selectedStudent);
    }
    return timeline.filter((e) => e.type === filter);
  }, [timeline, filter, selectedStudent]);

  const groupedTimeline = useMemo(() => {
    const groups = {};
    filteredTimeline.forEach((event) => {
      const date = event.timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [filteredTimeline]);

  const handleStudentClick = (studentId) => {
    setSelectedStudent(selectedStudent === studentId ? null : studentId);
    if (onSelectStudent) {
      const student = students.find((s) => s._id === studentId);
      if (student) onSelectStudent(student);
    }
  };

  return (
    <div className="student-timeline">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Student Timeline</p>
          <h3>Activity & journey tracking</h3>
        </div>
        <div className="timeline-controls">
          <div className="filter-group">
            <Filter size={14} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="timeline-filter">
              <option value="all">All Events</option>
              <option value="created">Added</option>
              <option value="milestone">Milestones</option>
              <option value="alert">Alerts</option>
              {selectedStudent && <option value="student">Selected Student</option>}
            </select>
          </div>
        </div>
      </header>

      <div className="timeline-container">
        {groupedTimeline.length === 0 ? (
          <div className="timeline-empty">
            <Clock size={32} />
            <p>No timeline events yet. Add students to see their journey.</p>
          </div>
        ) : (
          groupedTimeline.map(([date, events]) => (
            <div key={date} className="timeline-group">
              <div className="timeline-date">{date}</div>
              <div className="timeline-events">
                {events.map((event) => {
                  const typeConfig = EVENT_TYPES[event.type];
                  return (
                    <div
                      key={event.id}
                      className={`timeline-event is-${typeConfig.color}`}
                      onClick={() => handleStudentClick(event.studentId)}
                    >
                      <div className="event-icon">{typeConfig.icon}</div>
                      <div className="event-content">
                        <div className="event-header">
                          <span className="event-type">{typeConfig.label}</span>
                          <span className="event-time">
                            {event.timestamp.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="event-description">{event.description}</p>
                        <div className="event-student">{event.studentName}</div>
                        {event.metadata && (
                          <div className="event-metadata">
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <span key={key} className="metadata-tag">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

