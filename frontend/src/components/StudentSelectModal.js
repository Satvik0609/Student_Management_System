import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StudentSelectModal = ({ open, onClose, students, onSelect, title = 'Select Student' }) => {
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filtered = students.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.usn || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by name or USN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <p className="text-muted text-center">No students found</p>
              ) : (
                <div className="list-group">
                  {filtered.map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        onSelect(student);
                        onClose();
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{student.name}</div>
                          <small className="text-muted">{student.usn} • {student.department}</small>
                        </div>
                        <span className="badge bg-primary">{student.percentage || 0}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StudentSelectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  students: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default StudentSelectModal;

