import React from 'react';

const Spinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  );
};

export default Spinner;


