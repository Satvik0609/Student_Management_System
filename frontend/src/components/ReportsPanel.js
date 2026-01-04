import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Layers, LayoutGrid, Printer } from 'lucide-react';

const REPORTS = [
  {
    id: 'individual',
    title: 'Individual report card (PDF)',
    description: 'Export a single student’s marks, attendance, and remarks.',
    icon: <FileText size={20} />
  },
  {
    id: 'class',
    title: 'Class performance report',
    description: 'Summary of averages, pass rate, and grade distribution.',
    icon: <Layers size={20} />
  },
  {
    id: 'department',
    title: 'Department analysis',
    description: 'Compare departments on enrollment, scores, and attendance.',
    icon: <LayoutGrid size={20} />
  },
  {
    id: 'custom',
    title: 'Custom report builder',
    description: 'Pick KPIs and generate a custom PDF report.',
    icon: <Printer size={20} />
  }
];

const ReportsPanel = ({ onGenerate }) => (
  <div className="reports-panel row g-3">
    {REPORTS.map((report) => (
      <div className="col-md-6" key={report.id}>
        <div className="card h-100">
          <div className="card-body d-flex flex-column">
            <div className="d-flex align-items-center gap-2 mb-2">
              {report.icon}
              <h5 className="m-0">{report.title}</h5>
            </div>
            <p className="text-muted flex-grow-1">{report.description}</p>
            <button className="btn btn-primary align-self-start" onClick={() => onGenerate(report.id)}>
              Generate
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

ReportsPanel.propTypes = {
  onGenerate: PropTypes.func.isRequired
};

export default ReportsPanel;


