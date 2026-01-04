import React from 'react';
import { useCollaboration } from '../context/CollaborationContext';
import { Users, Wifi, WifiOff, Clock } from 'lucide-react';

const CollaborationPanel = () => {
  const { activeUsers, isConnected, activities } = useCollaboration();

  return (
    <div className="collaboration-panel">
      <div className="d-flex align-items-center gap-2 mb-3">
        {isConnected ? <Wifi size={16} className="text-success" /> : <WifiOff size={16} className="text-danger" />}
        <span className="small fw-semibold">
          {isConnected ? 'Live' : 'Offline'} • {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''} online
        </span>
      </div>

      {activeUsers.length > 0 && (
        <div className="mb-3">
          <div className="small text-muted mb-2">Active Users:</div>
          <div className="d-flex flex-wrap gap-2">
            {activeUsers.map((user, idx) => (
              <span
                key={idx}
                className="badge rounded-pill"
                style={{ backgroundColor: user.color || '#6366f1', color: '#fff' }}
              >
                {user.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <div className="small text-muted mb-2 d-flex align-items-center gap-1">
            <Clock size={12} />
            Recent Activity
          </div>
          <div className="activity-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {activities.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="small mb-1 text-muted">
                {activity.user?.name && (
                  <span style={{ color: activity.user.color }}>{activity.user.name}</span>
                )}{' '}
                {activity.type === 'joined' && 'joined'}
                {activity.type === 'left' && 'left'}
                {activity.type === 'student-created' && 'created a student'}
                {activity.type === 'student-updated' && 'updated a student'}
                {activity.type === 'student-deleted' && 'deleted a student'}
                {activity.timestamp && (
                  <span className="ms-1">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;

