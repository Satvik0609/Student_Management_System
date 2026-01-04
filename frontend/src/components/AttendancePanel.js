import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const formatDate = (date) => date.toISOString().slice(0, 10);

const AttendancePanel = ({ students = [], attendance = {}, onMark }) => {
  const [selectedStudent, setSelectedStudent] = useState(students[0]?._id || '');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [status, setStatus] = useState('present');

  const percentages = useMemo(() => {
    return students.map((student) => {
      const record = attendance[student._id] || {};
      const values = Object.values(record);
      const present = values.filter((v) => v === 'present').length;
      const pct = values.length ? Math.round((present / values.length) * 100) : 100;
      return { ...student, attendancePct: pct };
    });
  }, [attendance, students]);

  const lowAttendance = percentages.filter((s) => s.attendancePct < 75);

  const calendarData = useMemo(() => {
    const arr = [];
    for (let i = 13; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = formatDate(date);
      const presentCount = students.filter((s) => (attendance[s._id]?.[key] || 'absent') === 'present').length;
      arr.push({
        date: key,
        rate: students.length ? Math.round((presentCount / students.length) * 100) : 0
      });
    }
    return arr;
  }, [attendance, students]);

  const handleMark = () => {
    if (!selectedStudent) return;
    onMark(selectedStudent, selectedDate, status);
  };

  return (
    <div className="attendance-panel">
      <div className="row g-3">
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-uppercase text-muted small">Mark attendance</div>
                  <h5 className="m-0">Daily tracker</h5>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Student</label>
                <select className="form-select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>{student.name} ({student.department})</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <div className="btn-group w-100">
                  <button type="button" className={`btn btn-outline-success ${status === 'present' ? 'active' : ''}`} onClick={() => setStatus('present')}>Present</button>
                  <button type="button" className={`btn btn-outline-danger ${status === 'absent' ? 'active' : ''}`} onClick={() => setStatus('absent')}>Absent</button>
                </div>
              </div>
              <button className="btn btn-primary w-100" onClick={handleMark}>Save attendance</button>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-uppercase text-muted small">Calendar view (last 14 days)</div>
              <div className="d-flex flex-wrap gap-3 mt-3">
                {calendarData.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="small text-muted">{day.date.slice(5)}</div>
                    <div className="attendance-pill" style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))` }}>
                      {day.rate}%
                    </div>
                  </div>
                ))}
              </div>
              {lowAttendance.length > 0 && (
                <div className="alert alert-warning mt-4 mb-0">
                  <strong>Low attendance alerts:</strong>
                  <ul className="mb-0 mt-2">
                    {lowAttendance.map((student) => (
                      <li key={student._id}>{student.name} ({student.attendancePct}%)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <div className="text-uppercase text-muted small">Monthly report</div>
              <h5 className="m-0">Attendance summary</h5>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => onMark('EXPORT_REPORT')}>
              Export JSON
            </button>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {percentages.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{student.attendancePct}%</td>
                    <td>
                      <span className={`badge ${student.attendancePct < 75 ? 'bg-danger' : student.attendancePct < 90 ? 'bg-warning' : 'bg-success'}`}>
                        {student.attendancePct < 75 ? 'At risk' : student.attendancePct < 90 ? 'Monitor' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

AttendancePanel.propTypes = {
  students: PropTypes.array.isRequired,
  attendance: PropTypes.object.isRequired,
  onMark: PropTypes.func.isRequired
};

export default AttendancePanel;


