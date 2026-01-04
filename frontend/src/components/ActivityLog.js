import React, { useState, useMemo } from 'react';
import { History, Filter, Search, Download, User, Edit, Trash2, Plus, FileText, Calendar, Clock } from 'lucide-react';

export default function ActivityLog({ activities = [], currentUser }) {
  const [filter, setFilter] = useState({
    type: '', // create, update, delete
    user: '',
    dateRange: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, type

  // Generate mock activities if none provided
  const allActivities = useMemo(() => {
    if (activities && activities.length > 0) {
      return activities;
    }
    // Generate sample activities for demo
    return [];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let filtered = [...allActivities];

    if (filter.type) {
      filtered = filtered.filter(a => a.type === filter.type);
    }
    if (filter.user) {
      filtered = filtered.filter(a => a.user?.toLowerCase().includes(filter.user.toLowerCase()));
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.description?.toLowerCase().includes(searchLower) ||
        a.target?.toLowerCase().includes(searchLower) ||
        a.user?.toLowerCase().includes(searchLower)
      );
    }
    if (filter.dateRange) {
      const now = new Date();
      const daysAgo = parseInt(filter.dateRange);
      const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => new Date(a.timestamp) >= cutoff);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      switch (sortBy) {
        case 'recent':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [allActivities, filter, sortBy]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <Plus size={16} />;
      case 'update':
        return <Edit size={16} />;
      case 'delete':
        return <Trash2 size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'create':
        return 'var(--success)';
      case 'update':
        return 'var(--primary)';
      case 'delete':
        return 'var(--danger)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportLog = () => {
    const data = filteredActivities.map(a => ({
      timestamp: a.timestamp,
      type: a.type,
      user: a.user,
      description: a.description,
      target: a.target,
      changes: a.changes,
      ip: a.ip,
      userAgent: a.userAgent
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activityStats = useMemo(() => {
    const stats = {
      total: filteredActivities.length,
      create: filteredActivities.filter(a => a.type === 'create').length,
      update: filteredActivities.filter(a => a.type === 'update').length,
      delete: filteredActivities.filter(a => a.type === 'delete').length
    };
    return stats;
  }, [filteredActivities]);

  return (
    <div className="activity-log">
      <div className="activity-header">
        <div className="activity-title">
          <History size={24} />
          <h2>Activity Log & Audit Trail</h2>
        </div>
        <div className="activity-stats">
          <div className="stat-item">
            <span className="stat-value">{activityStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--success)' }}>{activityStats.create}</span>
            <span className="stat-label">Created</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{activityStats.update}</span>
            <span className="stat-label">Updated</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--danger)' }}>{activityStats.delete}</span>
            <span className="stat-label">Deleted</span>
          </div>
        </div>
      </div>

      <div className="activity-filters">
        <div className="filter-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search activities..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
          </select>
        </div>
        <div className="filter-group">
          <User size={18} />
          <input
            type="text"
            placeholder="Filter by user..."
            value={filter.user}
            onChange={(e) => setFilter({ ...filter, user: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <Calendar size={18} />
          <select
            value={filter.dateRange}
            onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
          >
            <option value="">All Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="type">By Type</option>
          </select>
        </div>
        <button className="export-btn" onClick={exportLog}>
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="activity-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <History size={48} />
            <p>No activities found</p>
            <small>Activities will appear here as users interact with the system</small>
          </div>
        ) : (
          filteredActivities.map((activity, idx) => (
            <div key={activity.id || idx} className="activity-item">
              <div
                className="activity-icon"
                style={{ backgroundColor: getActivityColor(activity.type) + '20', color: getActivityColor(activity.type) }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-description">
                  <strong>{activity.user || 'System'}</strong>
                  <span>{activity.description || `${activity.type} ${activity.target || 'record'}`}</span>
                </div>
                {activity.changes && (
                  <div className="activity-changes">
                    {Object.entries(activity.changes).map(([key, value]) => (
                      <span key={key} className="change-badge">
                        {key}: {value.old} → {value.new}
                      </span>
                    ))}
                  </div>
                )}
                <div className="activity-meta">
                  <span className="activity-time">
                    <Clock size={14} />
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  {activity.ip && (
                    <span className="activity-ip">IP: {activity.ip}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

