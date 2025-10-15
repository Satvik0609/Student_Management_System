// Placeholder file for potential shared primitives; kept minimal to avoid extra deps
export const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);
export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);


