import React, { useState, useMemo } from 'react';
import { Package, CheckSquare, X, Upload, Download, Edit, Trash2, Save, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

export default function BulkOperations({ students = [], onBulkUpdate, onBulkDelete, onBulkImport }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [operation, setOperation] = useState(''); // update, delete, import
  const [updateFields, setUpdateFields] = useState({
    department: '',
    passStatus: '',
    percentage: '',
    attendance: ''
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState('json'); // json, csv

  const selectedStudents = useMemo(() => {
    return students.filter(s => selectedIds.has(s._id));
  }, [students, selectedIds]);

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map(s => s._id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    setResult(null);

    try {
      const updates = {};
      if (updateFields.department) updates.department = updateFields.department;
      if (updateFields.passStatus) updates.passStatus = updateFields.passStatus;
      if (updateFields.percentage) updates.percentage = parseFloat(updateFields.percentage);
      if (updateFields.attendance) updates.attendance = parseFloat(updateFields.attendance);

      if (Object.keys(updates).length === 0) {
        setResult({ success: false, message: 'Please select at least one field to update' });
        setLoading(false);
        return;
      }

      const result = await onBulkUpdate(Array.from(selectedIds), updates);
      setResult(result);
      setSelectedIds(new Set());
      setUpdateFields({ department: '', passStatus: '', percentage: '', attendance: '' });
      setOperation('');
      setShowConfirm(false);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    setResult(null);

    try {
      const result = await onBulkDelete(Array.from(selectedIds));
      setResult(result);
      setSelectedIds(new Set());
      setOperation('');
      setShowConfirm(false);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!importData.trim()) {
      setResult({ success: false, message: 'Please provide import data' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let parsedData;
      if (importFormat === 'json') {
        parsedData = JSON.parse(importData);
      } else {
        // CSV parsing (simplified)
        const lines = importData.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header] = values[idx];
          });
          return obj;
        });
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('Import data must be an array');
      }

      const result = await onBulkImport(parsedData);
      setResult(result);
      setImportData('');
      setOperation('');
    } catch (error) {
      setResult({ success: false, message: `Import failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const exportSelected = () => {
    if (selectedIds.size === 0) return;
    
    const data = selectedStudents.map(s => ({
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber,
      department: s.department,
      percentage: s.percentage,
      attendance: s.attendance,
      passStatus: s.passStatus
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bulk-operations">
      <div className="bulk-header">
        <div className="bulk-title">
          <Package size={24} />
          <h2>Bulk Operations</h2>
        </div>
        <div className="selection-info">
          <CheckSquare size={18} />
          <span>{selectedIds.size} of {students.length} selected</span>
          {selectedIds.size > 0 && (
            <button className="clear-selection" onClick={() => setSelectedIds(new Set())}>
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className={`result-banner ${result.success ? 'success' : 'error'}`}>
          {result.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{result.message}</span>
          <button onClick={() => setResult(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bulk-actions-grid">
        <button
          className={`action-card ${operation === 'update' ? 'active' : ''}`}
          onClick={() => setOperation(operation === 'update' ? '' : 'update')}
          disabled={selectedIds.size === 0}
        >
          <Edit size={24} />
          <span>Bulk Update</span>
          <small>Update {selectedIds.size} selected</small>
        </button>

        <button
          className={`action-card ${operation === 'delete' ? 'active' : ''}`}
          onClick={() => {
            setOperation(operation === 'delete' ? '' : 'delete');
            setShowConfirm(true);
          }}
          disabled={selectedIds.size === 0}
        >
          <Trash2 size={24} />
          <span>Bulk Delete</span>
          <small>Delete {selectedIds.size} selected</small>
        </button>

        <button
          className={`action-card ${operation === 'import' ? 'active' : ''}`}
          onClick={() => setOperation(operation === 'import' ? '' : 'import')}
        >
          <Upload size={24} />
          <span>Bulk Import</span>
          <small>Add multiple students</small>
        </button>

        <button
          className="action-card"
          onClick={exportSelected}
          disabled={selectedIds.size === 0}
        >
          <Download size={24} />
          <span>Export Selected</span>
          <small>Download {selectedIds.size} students</small>
        </button>
      </div>

      {operation === 'update' && (
        <div className="bulk-update-panel">
          <h3>Update Fields for {selectedIds.size} Students</h3>
          <div className="update-fields">
            <div className="field-group">
              <label>Department</label>
              <select
                value={updateFields.department}
                onChange={(e) => setUpdateFields({ ...updateFields, department: e.target.value })}
              >
                <option value="">Keep unchanged</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
            <div className="field-group">
              <label>Pass Status</label>
              <select
                value={updateFields.passStatus}
                onChange={(e) => setUpdateFields({ ...updateFields, passStatus: e.target.value })}
              >
                <option value="">Keep unchanged</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            <div className="field-group">
              <label>Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Leave empty to keep unchanged"
                value={updateFields.percentage}
                onChange={(e) => setUpdateFields({ ...updateFields, percentage: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Attendance</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Leave empty to keep unchanged"
                value={updateFields.attendance}
                onChange={(e) => setUpdateFields({ ...updateFields, attendance: e.target.value })}
              />
            </div>
          </div>
          <div className="update-actions">
            <button className="btn-secondary" onClick={() => setOperation('')}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleBulkUpdate}
              disabled={loading}
            >
              {loading ? <Loader size={16} className="spinner" /> : <Save size={16} />}
              Apply Update
            </button>
          </div>
        </div>
      )}

      {operation === 'import' && (
        <div className="bulk-import-panel">
          <h3>Bulk Import Students</h3>
          <div className="import-format-selector">
            <label>Format:</label>
            <select value={importFormat} onChange={(e) => setImportFormat(e.target.value)}>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <textarea
            className="import-textarea"
            placeholder={importFormat === 'json' 
              ? 'Paste JSON array of students...\n[{"name": "John", "email": "john@example.com", ...}, ...]'
              : 'Paste CSV data...\nname,email,department,percentage,attendance\nJohn,john@example.com,CS,85,90'
            }
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            rows={10}
          />
          <div className="import-actions">
            <button className="btn-secondary" onClick={() => setOperation('')}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleBulkImport}
              disabled={loading || !importData.trim()}
            >
              {loading ? <Loader size={16} className="spinner" /> : <Upload size={16} />}
              Import Students
            </button>
          </div>
        </div>
      )}

      {showConfirm && operation === 'delete' && (
        <div className="confirm-dialog-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={32} className="warning-icon" />
            <h3>Confirm Bulk Delete</h3>
            <p>Are you sure you want to delete {selectedIds.size} student(s)? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => {
                setShowConfirm(false);
                setOperation('');
              }}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleBulkDelete}
                disabled={loading}
              >
                {loading ? <Loader size={16} className="spinner" /> : <Trash2 size={16} />}
                Delete {selectedIds.size} Students
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="students-selection-list">
        <div className="selection-header">
          <label className="select-all-checkbox">
            <input
              type="checkbox"
              checked={selectedIds.size === students.length && students.length > 0}
              onChange={toggleSelectAll}
            />
            <span>Select All ({students.length})</span>
          </label>
        </div>
        <div className="students-grid">
          {students.map(student => (
            <div
              key={student._id}
              className={`student-select-card ${selectedIds.has(student._id) ? 'selected' : ''}`}
              onClick={() => toggleSelect(student._id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(student._id)}
                onChange={() => toggleSelect(student._id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="student-info">
                <strong>{student.name}</strong>
                <small>{student.department}</small>
                <small>{student.percentage}% • {student.passStatus}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

