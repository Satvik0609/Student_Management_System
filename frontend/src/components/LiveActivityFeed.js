import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useCollaboration } from '../context/CollaborationContext';
import { Clock, UserPlus, Edit, Trash2, FileText } from 'lucide-react';

const activityIcons = {
  'student-added': UserPlus,
  'student-edited': Edit,
  'student-deleted': Trash2,
  'report-generated': FileText
};

const LiveActivityFeed = ({ maxItems = 10 }) => {
  const { activities } = useCollaboration();
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [activities]);

  const formatTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="live-activity-feed">
      <div className="live-activity-header">
        <Clock size={16} />
        <span>Live Activity</span>
        <span className="live-badge">LIVE</span>
      </div>
      <div className="live-activity-list" ref={feedRef}>
        {activities.length === 0 ? (
          <div className="live-activity-empty">No recent activity</div>
        ) : (
          activities.slice(0, maxItems).map((activity) => {
            const Icon = activityIcons[activity.type] || Edit;
            return (
              <div key={activity.id} className="live-activity-item">
                <div
                  className="live-activity-avatar"
                  style={{ backgroundColor: activity.user?.color || '#6366f1' }}
                >
                  {activity.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="live-activity-content">
                  <div className="live-activity-text">
                    <Icon size={14} />
                    <span>
                      <strong>{activity.user?.name || 'Someone'}</strong> {activity.message}
                    </span>
                  </div>
                  <div className="live-activity-time">{formatTime(activity.timestamp)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

LiveActivityFeed.propTypes = {
  maxItems: PropTypes.number
};

export default LiveActivityFeed;

