import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AVAILABLE_KPIS = [
  'Total Students',
  'Average Percentage',
  'Pass Rate',
  'Pass Count',
  'Fail Count',
  'Grade Distribution',
  'Top Performers',
  'Department Breakdown'
];

const CustomReportModal = ({ open, onClose, onGenerate }) => {
  const [selectedKPIs, setSelectedKPIs] = useState(['Total Students', 'Average Percentage', 'Pass Rate']);

  if (!open) return null;

  const toggleKPI = (kpi) => {
    setSelectedKPIs((prev) =>
      prev.includes(kpi) ? prev.filter((k) => k !== kpi) : [...prev, kpi]
    );
  };

  const handleGenerate = () => {
    if (selectedKPIs.length === 0) {
      alert('Please select at least one KPI');
      return;
    }
    onGenerate(selectedKPIs);
    onClose();
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Custom Report Builder</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted">Select the metrics you want to include in your report:</p>
            <div className="list-group">
              {AVAILABLE_KPIS.map((kpi) => (
                <label key={kpi} className="list-group-item">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={selectedKPIs.includes(kpi)}
                    onChange={() => toggleKPI(kpi)}
                  />
                  {kpi}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <small className="text-muted">Selected: {selectedKPIs.length} KPI(s)</small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleGenerate}>
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CustomReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired
};

export default CustomReportModal;

