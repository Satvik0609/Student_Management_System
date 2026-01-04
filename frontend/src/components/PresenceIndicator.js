import React from 'react';
import PropTypes from 'prop-types';
import { Users } from 'lucide-react';

const PresenceIndicator = ({ users, maxVisible = 3 }) => {
  if (!users || users.length === 0) return null;

  const visible = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <div className="presence-indicator">
      <div className="presence-avatars">
        {visible.map((user, idx) => (
          <div
            key={user.id}
            className="presence-avatar"
            style={{
              backgroundColor: user.color || '#6366f1',
              marginLeft: idx > 0 ? '-8px' : '0',
              zIndex: visible.length - idx
            }}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {remaining > 0 && (
          <div
            className="presence-avatar presence-more"
            style={{ marginLeft: '-8px', zIndex: 0 }}
            title={`${remaining} more user${remaining > 1 ? 's' : ''}`}
          >
            +{remaining}
          </div>
        )}
      </div>
      <div className="presence-text">
        <Users size={14} />
        <span>{users.length} active</span>
      </div>
    </div>
  );
};

PresenceIndicator.propTypes = {
  users: PropTypes.array.isRequired,
  maxVisible: PropTypes.number
};

export default PresenceIndicator;

