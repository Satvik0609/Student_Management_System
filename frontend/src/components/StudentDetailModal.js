import React from 'react';
import PropTypes from 'prop-types';

const StudentDetailModal = ({ open, onClose, student }) => {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl animate-[fadeIn_0.2s_ease]">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h5 className="m-0 text-xl font-semibold">Student Details</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="p-6">
            <div className="row g-3">
              <div className="col-md-3 text-center">
                <img
                  src={student.photoUrl || 'https://via.placeholder.com/150'}
                  alt={student.name}
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-sm-6"><strong>Name:</strong> {student.name}</div>
                  <div className="col-sm-6"><strong>USN:</strong> {student.usn}</div>
                  <div className="col-sm-6"><strong>Department:</strong> {student.department}</div>
                  <div className="col-sm-6"><strong>Email:</strong> {student.email || '-'} </div>
                  <div className="col-sm-6"><strong>Phone:</strong> {student.phone || '-'} </div>
                  <div className="col-sm-6"><strong>Gender:</strong> {student.gender || '-'} </div>
                  <div className="col-sm-6"><strong>DOB:</strong> {student.dob ? new Date(student.dob).toLocaleDateString() : '-'} </div>
                  <div className="col-sm-6"><strong>Enrollment:</strong> {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '-'} </div>
                  <div className="col-12 mt-2"><strong>Address:</strong> {student.address || '-'} </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4"><strong>Total:</strong> {student.totalMarks}</div>
                  <div className="col-sm-4"><strong>Percentage:</strong> {student.percentage}%</div>
                  <div className="col-sm-4"><strong>CGPA:</strong> {student.cgpa}</div>
                  <div className="col-sm-4 mt-2"><strong>Grade:</strong> {student.grade}</div>
                  <div className="col-sm-4 mt-2"><strong>Status:</strong> {student.passStatus}</div>
                </div>
                <div className="mt-3">
                  <h6>Subjects</h6>
                  <div className="row">
                    <div className="col-sm-6">Mathematics: {student.subjects?.mathematics ?? 0}</div>
                    <div className="col-sm-6">Physics: {student.subjects?.physics ?? 0}</div>
                    <div className="col-sm-6">Chemistry: {student.subjects?.chemistry ?? 0}</div>
                    <div className="col-sm-6">English: {student.subjects?.english ?? 0}</div>
                    <div className="col-sm-6">Computer Science: {student.subjects?.computerScience ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className="px-6 py-4 border-t flex justify-end">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

StudentDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  student: PropTypes.object
};

export default StudentDetailModal;


