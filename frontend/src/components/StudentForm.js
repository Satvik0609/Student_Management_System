import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { addStudent, updateStudent, getStudentById } from '../services/StudentService';
import { useStudentsContext } from '../context/StudentsContext';

const initialSubjects = {
  mathematics: 0,
  physics: 0,
  chemistry: 0,
  english: 0,
  computerScience: 0
};

const StudentForm = ({ open, onClose, refreshStudents, editId }) => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: '',
    email: '',
    phone: '',
    dob: '',
    enrollmentDate: '',
    gender: '',
    address: '',
    photoUrl: '',
    subjects: initialSubjects
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingUsn, setCheckingUsn] = useState(false);
  const { students } = useStudentsContext() || { students: [] };

  useEffect(() => {
    if (!open) return;
    if (editId) {
      (async () => {
        try {
          const data = await getStudentById(editId);
          setFormData({
            name: data.name || '',
            usn: data.usn || '',
            department: data.department || '',
            email: data.email || '',
            phone: data.phone || '',
            dob: data.dob ? data.dob.substring(0,10) : '',
            enrollmentDate: data.enrollmentDate ? data.enrollmentDate.substring(0,10) : '',
            gender: data.gender || '',
            address: data.address || '',
            photoUrl: data.photoUrl || '',
            subjects: {
              mathematics: data.subjects?.mathematics ?? 0,
              physics: data.subjects?.physics ?? 0,
              chemistry: data.subjects?.chemistry ?? 0,
              english: data.subjects?.english ?? 0,
              computerScience: data.subjects?.computerScience ?? 0
            }
          });
        } catch {
          // ignore
        }
      })();
    } else {
      setFormData({
        name: '',
        usn: '',
        department: '',
        email: '',
        phone: '',
        dob: '',
        enrollmentDate: new Date().toISOString().substring(0,10),
        gender: '',
        address: '',
        photoUrl: '',
        subjects: { ...initialSubjects }
      });
      setErrors({});
    }
  }, [open, editId]);

  const validate = useMemo(() => ({
    name: (v) => /^(?=.{3,})[A-Za-z ]+$/.test(v || '') ? '' : 'Name must be 3+ letters/spaces',
    usn: (v) => /^[A-Za-z0-9-]{3,}$/.test(v || '') ? '' : 'USN must be alphanumeric',
    department: (v) => (v ? '' : 'Department is required'),
    email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Invalid email'),
    phone: (v) => (!v || /^\d{10}$/.test(v) ? '' : 'Phone must be 10 digits'),
    dob: () => '',
    gender: () => '',
    address: () => '',
    photoUrl: () => '',
    subjects: (subj) => {
      const keys = Object.keys(initialSubjects);
      for (const k of keys) {
        const n = Number(subj[k]);
        if (!Number.isFinite(n) || n < 0 || n > 100) return 'Marks must be 0-100';
      }
      return '';
    }
  }), []);

  const runValidation = async (field, value) => {
    let msg = '';
    if (field === 'usn') {
      msg = validate.usn(value);
      if (!editId && !msg && value) {
        setCheckingUsn(true);
        const existsLocal = students.some(s => String(s.usn).toUpperCase().trim() === String(value).toUpperCase().trim());
        if (existsLocal) msg = 'USN already exists';
        setCheckingUsn(false);
      }
    } else if (field === 'subjects') {
      msg = validate.subjects(value);
    } else if (validate[field]) {
      msg = validate[field](value);
    }
    setErrors((e) => ({ ...e, [field]: msg }));
    return msg;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    runValidation(name, value);
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    const n = value === '' ? '' : Number(value);
    const subjects = { ...formData.subjects, [name]: n };
    setFormData((prev) => ({ ...prev, subjects }));
    runValidation('subjects', subjects);
  };

  const allValid = useMemo(() => {
    const v = {
      name: validate.name(formData.name),
      usn: validate.usn(formData.usn),
      department: validate.department(formData.department),
      email: validate.email(formData.email),
      phone: validate.phone(formData.phone),
      subjects: validate.subjects(formData.subjects)
    };
    return Object.values(v).every((m) => m === '') && !checkingUsn;
  }, [formData, validate, checkingUsn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    try {
      if (editId) {
        await updateStudent(editId, formData);
      } else {
        await addStudent(formData);
      }
      refreshStudents();
      onClose();
    } catch (err) {
      // surface error near top-level if server rejects
      setErrors((e) => ({ ...e, submit: err.response?.data?.message || 'Save failed' }));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editId ? 'Edit Student' : 'Add Student'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
                  {errors.name && <div className="text-danger small">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">USN</label>
                  <input className="form-control" name="usn" value={formData.usn} onChange={handleChange} disabled={!!editId} />
                  {errors.usn && <div className="text-danger small">{errors.usn}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input className="form-control" name="department" value={formData.department} onChange={handleChange} />
                  {errors.department && <div className="text-danger small">{errors.department}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <div className="text-danger small">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Enrollment Date</label>
                  <input type="date" className="form-control" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="address" rows="2" value={formData.address} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Photo URL</label>
                  <input className="form-control" name="photoUrl" value={formData.photoUrl} onChange={handleChange} />
                  {formData.photoUrl && (
                    <img alt="preview" src={formData.photoUrl} className="img-thumbnail mt-2" style={{ maxWidth: 150 }} />
                  )}
                </div>
                <div className="col-12">
                  <h6>Subjects</h6>
                </div>
                {Object.keys(initialSubjects).map((k) => (
                  <div className="col-md-4" key={k}>
                    <label className="form-label text-capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
                    <input type="number" className="form-control" name={k} value={formData.subjects[k]} onChange={handleSubjectChange} min="0" max="100" />
                  </div>
                ))}
                {errors.subjects && <div className="col-12 text-danger small">{errors.subjects}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading || !allValid}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
StudentForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshStudents: PropTypes.func.isRequired,
  editId: PropTypes.string
};