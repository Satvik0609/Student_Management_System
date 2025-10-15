import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ show, type = 'success', message = '', onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-700';

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
      <div className={`text-white ${bg} shadow-lg rounded-md px-4 py-3 transition-all`}>
        <div className="d-flex align-items-center">
          <div className="me-3">{message}</div>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  type: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number
};


