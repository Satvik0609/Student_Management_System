import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';

const getInitials = (name = '') => {
  const parts = String(name).trim().split(' ');
  if (parts.length === 0) return 'SR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ActivityFeed = ({ items }) => {
  const feed = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 5)
      .map((entry) => ({
        id: entry._id,
        name: entry.name,
        department: entry.department,
        percentage: entry.percentage ?? 0,
        updatedAt: entry.updatedAt || entry.createdAt
      }));
  }, [items]);

  if (feed.length === 0) {
    return (
      <div className="activity-feed">
        <div className="activity-feed__header">
          <Clock size={16} />
          Recent activity
        </div>
        <p className="activity-feed__empty">Add students to see an activity timeline.</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <Clock size={16} />
        Recent activity
      </div>
      <ul className="activity-feed__list">
        {feed.map((item) => (
          <li key={item.id}>
            <div className="activity-feed__avatar">{getInitials(item.name)}</div>
            <div className="activity-feed__meta">
              <div className="activity-feed__title">
                {item.name} <span className="activity-feed__badge">{item.department}</span>
              </div>
              <div className="activity-feed__subtitle">
                {item.percentage}% overall • {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'today'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ActivityFeed.propTypes = {
  items: PropTypes.array.isRequired
};

export default ActivityFeed;


