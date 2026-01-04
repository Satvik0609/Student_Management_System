import React, { useMemo } from 'react';
import { Zap, Users, Download, Upload, Search, Filter, BarChart3, Target, Bell, Settings, Database } from 'lucide-react';

const ACTION_GROUPS = [
  {
    id: 'data',
    label: 'Data Management',
    icon: <Database size={18} />,
    actions: [
      { id: 'import', label: 'Import CSV/JSON', icon: <Upload size={16} />, shortcut: 'Ctrl+I' },
      { id: 'export', label: 'Export Data', icon: <Download size={16} />, shortcut: 'Ctrl+E' },
      { id: 'bulk-edit', label: 'Bulk Edit', icon: <Users size={16} /> }
    ]
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: <BarChart3 size={18} />,
    actions: [
      { id: 'analytics', label: 'View Analytics', icon: <BarChart3 size={16} />, shortcut: 'Ctrl+A' },
      { id: 'predictive', label: 'Predictive Forecast', icon: <Target size={16} /> },
      { id: 'visualization', label: 'Create Chart', icon: <BarChart3 size={16} /> }
    ]
  },
  {
    id: 'workflow',
    label: 'Quick Actions',
    icon: <Zap size={18} />,
    actions: [
      { id: 'search', label: 'Quick Search', icon: <Search size={16} />, shortcut: 'Ctrl+F' },
      { id: 'filters', label: 'Apply Filters', icon: <Filter size={16} /> },
      { id: 'notifications', label: 'View Notifications', icon: <Bell size={16} /> }
    ]
  }
];

export default function QuickActions({ onAction, students = [] }) {
  const contextActions = useMemo(() => {
    const actions = [];
    const total = students.length;
    const failing = students.filter((s) => s.passStatus === 'Fail').length;

    if (failing > 0) {
      actions.push({
        id: 'at-risk',
        label: `View ${failing} At-Risk Students`,
        icon: <Users size={16} />,
        priority: 'high',
        action: { filter: 'failed' }
      });
    }

    if (total > 0) {
      actions.push({
        id: 'export-all',
        label: 'Export All Records',
        icon: <Download size={16} />,
        priority: 'medium',
        action: { type: 'export' }
      });
    }

    return actions;
  }, [students]);

  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div className="quick-actions">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Quick Actions</p>
          <h3>Context-sensitive shortcuts</h3>
        </div>
        <div className="actions-badge">
          <Zap size={16} />
          {ACTION_GROUPS.reduce((sum, group) => sum + group.actions.length, 0) + contextActions.length} Actions
        </div>
      </header>

      {contextActions.length > 0 && (
        <div className="context-actions">
          <p className="context-label">Suggested Actions</p>
          <div className="context-grid">
            {contextActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`context-action is-${action.priority}`}
                onClick={() => handleAction(action.action)}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="actions-groups">
        {ACTION_GROUPS.map((group) => (
          <div key={group.id} className="action-group">
            <div className="group-header">
              {group.icon}
              <span>{group.label}</span>
            </div>
            <div className="group-actions">
              {group.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="action-btn"
                  onClick={() => handleAction({ type: action.id })}
                  title={action.shortcut ? `Shortcut: ${action.shortcut}` : ''}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.shortcut && <span className="action-shortcut">{action.shortcut}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

