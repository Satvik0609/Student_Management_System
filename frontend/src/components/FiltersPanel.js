import React, { useMemo } from 'react';
import { DEPARTMENTS } from './DepartmentBadges';

const GRADES = ['A+','A','B+','B','C','F'];

const FiltersPanel = ({
  filters,
  setFilters,
  onClear
}) => {
  const tags = useMemo(() => {
    const t = [];
    if (filters.departments?.length) t.push(...filters.departments.map(d => ({ key: `dept:${d}`, label: d })));
    if (filters.grades?.length) t.push(...filters.grades.map(g => ({ key: `grade:${g}`, label: `Grade ${g}` })));
    if (filters.passFail) t.push({ key: `pf:${filters.passFail}`, label: filters.passFail });
    if (filters.minMarks != null || filters.maxMarks != null) t.push({ key: 'marks', label: `Marks ${filters.minMarks ?? 0}-${filters.maxMarks ?? 100}` });
    return t;
  }, [filters]);

  const removeTag = (key) => {
    if (key.startsWith('dept:')) {
      const v = key.replace('dept:','');
      setFilters({ ...filters, departments: filters.departments.filter(d => d !== v) });
    } else if (key.startsWith('grade:')) {
      const g = key.replace('grade:','');
      setFilters({ ...filters, grades: filters.grades.filter(x => x !== g) });
    } else if (key.startsWith('pf:')) {
      setFilters({ ...filters, passFail: '' });
    } else if (key === 'marks') {
      setFilters({ ...filters, minMarks: 0, maxMarks: 100 });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Departments</label>
            <select multiple className="form-select" value={filters.departments} onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(o => o.value);
              setFilters({ ...filters, departments: selected });
            }}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Grades</label>
            <select multiple className="form-select" value={filters.grades} onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(o => o.value);
              setFilters({ ...filters, grades: selected });
            }}>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Pass/Fail</label>
            <select className="form-select" value={filters.passFail} onChange={(e) => setFilters({ ...filters, passFail: e.target.value })}>
              <option value="">All</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Marks Range</label>
            <div className="d-flex gap-2">
              <input type="number" className="form-control" min="0" max="100" value={filters.minMarks} onChange={(e) => setFilters({ ...filters, minMarks: Number(e.target.value) })} />
              <input type="number" className="form-control" min="0" max="100" value={filters.maxMarks} onChange={(e) => setFilters({ ...filters, maxMarks: Number(e.target.value) })} />
            </div>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-outline-secondary" onClick={onClear}>Clear All Filters</button>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-3 d-flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t.key} className="badge bg-light text-dark border">
                {t.label}
                <button type="button" className="btn-close btn-close" onClick={() => removeTag(t.key)} style={{ transform: 'scale(0.6)', marginLeft: 8 }}></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;


