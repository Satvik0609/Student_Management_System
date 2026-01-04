import React from 'react';
import { AlertTriangle, CheckCircle2, Trash2, Upload } from 'lucide-react';

const FEEDBACK_ITEMS = [
  {
    id: 'student-added',
    label: 'Student added successfully',
    description: 'The new record is synced with analytics and attendance.',
    icon: <CheckCircle2 size={18} />,
    tone: 'success'
  },
  {
    id: 'usn-exists',
    label: 'USN already exists',
    description: 'Try editing the existing record or assign a different USN.',
    icon: <AlertTriangle size={18} />,
    tone: 'warning'
  },
  {
    id: 'import-complete',
    label: 'Data imported: 45 students',
    description: 'You can undo or export the imported batch from the records tab.',
    icon: <Upload size={18} />,
    tone: 'info'
  },
  {
    id: 'deleted',
    label: '3 students deleted (Undo available)',
    description: 'Use the Undo button in the action dock to restore.',
    icon: <Trash2 size={18} />,
    tone: 'danger'
  }
];

const toneClass = {
  success: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  warning: 'text-amber-600 bg-amber-50 border-amber-100',
  info: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  danger: 'text-rose-600 bg-rose-50 border-rose-100'
};

const FeedbackPanel = ({ extraItems = [] }) => {
  const items = [...FEEDBACK_ITEMS, ...extraItems];
  return (
    <div className="feedback-panel">
      {items.map((item) => (
        <div key={item.id} className={`feedback-chip ${toneClass[item.tone] || ''}`}>
          <div className="icon">{item.icon}</div>
          <div>
            <div className="title">{item.label}</div>
            {item.description && <div className="note">{item.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackPanel;


