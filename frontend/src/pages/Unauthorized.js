import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <ShieldX size={80} />
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <p className="unauthorized-subtitle">Please contact your administrator if you believe this is an error.</p>
        <Link to="/" className="unauthorized-button">
          <Home size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

