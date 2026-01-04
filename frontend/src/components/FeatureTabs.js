import React from 'react';
import PropTypes from 'prop-types';

const FeatureTabs = ({ tabs, active, onChange }) => (
  <div className="feature-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={active === tab.id ? 'is-active' : ''}
        onClick={() => onChange(tab.id)}
      >
        <div className="label">{tab.label}</div>
        {tab.description && <div className="description">{tab.description}</div>}
      </button>
    ))}
  </div>
);

FeatureTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string
  })).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FeatureTabs;


