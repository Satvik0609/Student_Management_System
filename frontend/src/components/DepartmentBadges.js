import React from 'react';

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Information Technology',
  'Electrical'
];

const DepartmentBadges = ({ items }) => {
  const counts = DEPARTMENTS.reduce((acc, d) => {
    acc[d] = items.filter(s => s.department === d).length;
    return acc;
  }, {});
  return (
    <div className="d-flex flex-wrap gap-2">
      {DEPARTMENTS.map((d) => (
        <span key={d} className="px-2 py-1 rounded bg-gray-100 text-gray-700 border">
          {d}: {counts[d]}
        </span>
      ))}
    </div>
  );
};

export default DepartmentBadges;


