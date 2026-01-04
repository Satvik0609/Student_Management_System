import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Sparkles, TrendingUp, Users, Award, AlertTriangle, BookOpen, Calendar } from 'lucide-react';

export default function AdvancedSearch({ students = [], onSelectStudent, onApplyFilters }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    minPercentage: '',
    maxPercentage: '',
    passStatus: '',
    attendanceRange: '',
    searchMode: 'semantic' // semantic, exact, fuzzy
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Semantic search - understands intent
  const semanticSearch = (query, students) => {
    if (!query.trim()) return students;

    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(/\s+/);

    // Intent detection
    const isHighPerformer = /high|top|excellent|outstanding|best|great/i.test(query);
    const isLowPerformer = /low|poor|failing|at risk|struggling|weak/i.test(query);
    const isAverage = /average|moderate|middle|okay/i.test(query);
    const needsAttention = /attention|help|support|intervention|concern/i.test(query);
    const goodAttendance = /attendance|present|regular|consistent/i.test(query);

    return students.map(student => {
      let score = 0;
      const pct = student.percentage || 0;
      const attendance = student.attendance || 0;

      // Name matching
      if (student.name?.toLowerCase().includes(lowerQuery)) score += 10;
      if (student.email?.toLowerCase().includes(lowerQuery)) score += 8;
      if (student.department?.toLowerCase().includes(lowerQuery)) score += 6;

      // Keyword matching
      keywords.forEach(keyword => {
        if (student.name?.toLowerCase().includes(keyword)) score += 5;
        if (student.department?.toLowerCase().includes(keyword)) score += 3;
      });

      // Intent-based scoring
      if (isHighPerformer && pct >= 80) score += 15;
      if (isLowPerformer && pct < 60) score += 15;
      if (isAverage && pct >= 60 && pct < 80) score += 12;
      if (needsAttention && (pct < 60 || attendance < 70)) score += 15;
      if (goodAttendance && attendance >= 85) score += 10;

      // Percentage range queries
      const pctMatch = query.match(/(\d+)\s*%|(\d+)\s*percent/i);
      if (pctMatch) {
        const targetPct = parseInt(pctMatch[1] || pctMatch[2]);
        const diff = Math.abs(pct - targetPct);
        score += Math.max(0, 10 - diff);
      }

      return { ...student, _searchScore: score };
    }).filter(s => s._searchScore > 0)
      .sort((a, b) => b._searchScore - a._searchScore);
  };

  // Exact search
  const exactSearch = (query, students) => {
    if (!query.trim()) return students;
    const lowerQuery = query.toLowerCase();
    return students.filter(s => 
      s.name?.toLowerCase().includes(lowerQuery) ||
      s.email?.toLowerCase().includes(lowerQuery) ||
      s.department?.toLowerCase().includes(lowerQuery) ||
      s.rollNumber?.toLowerCase().includes(lowerQuery)
    );
  };

  // Fuzzy search (typo-tolerant)
  const fuzzySearch = (query, students) => {
    if (!query.trim()) return students;
    const lowerQuery = query.toLowerCase();
    
    const levenshtein = (str1, str2) => {
      const matrix = [];
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2[i - 1] === str1[j - 1]) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[str2.length][str1.length];
    };

    return students.map(s => {
      const name = (s.name || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const dept = (s.department || '').toLowerCase();
      
      const nameDist = levenshtein(lowerQuery, name.substring(0, lowerQuery.length + 3));
      const emailDist = levenshtein(lowerQuery, email.substring(0, lowerQuery.length + 3));
      const deptDist = levenshtein(lowerQuery, dept.substring(0, lowerQuery.length + 3));
      
      const minDist = Math.min(nameDist, emailDist, deptDist);
      return { ...s, _fuzzyScore: minDist };
    }).filter(s => s._fuzzyScore <= 2)
      .sort((a, b) => a._fuzzyScore - b._fuzzyScore);
  };

  const filteredStudents = useMemo(() => {
    let results = students;

    // Apply search
    if (query.trim()) {
      switch (filters.searchMode) {
        case 'semantic':
          results = semanticSearch(query, results);
          break;
        case 'exact':
          results = exactSearch(query, results);
          break;
        case 'fuzzy':
          results = fuzzySearch(query, results);
          break;
        default:
          results = semanticSearch(query, results);
      }
    }

    // Apply filters
    if (filters.department) {
      results = results.filter(s => s.department === filters.department);
    }
    if (filters.minPercentage) {
      results = results.filter(s => (s.percentage || 0) >= parseFloat(filters.minPercentage));
    }
    if (filters.maxPercentage) {
      results = results.filter(s => (s.percentage || 0) <= parseFloat(filters.maxPercentage));
    }
    if (filters.passStatus) {
      results = results.filter(s => s.passStatus === filters.passStatus);
    }
    if (filters.attendanceRange) {
      const [min, max] = filters.attendanceRange.split('-').map(Number);
      results = results.filter(s => {
        const att = s.attendance || 0;
        return att >= min && att <= max;
      });
    }

    return results;
  }, [query, filters, students]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() && !searchHistory.includes(value)) {
      setSearchHistory(prev => [value, ...prev.slice(0, 9)]);
    }
  };

  const saveSearch = () => {
    if (!query.trim() && Object.values(filters).every(v => !v)) return;
    const search = {
      id: Date.now(),
      name: query || 'Saved Filter',
      query,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    setSavedSearches(prev => [...prev, search]);
  };

  const loadSearch = (search) => {
    setQuery(search.query);
    setFilters(search.filters);
  };

  const clearFilters = () => {
    setQuery('');
    setFilters({
      department: '',
      minPercentage: '',
      maxPercentage: '',
      passStatus: '',
      attendanceRange: '',
      searchMode: 'semantic'
    });
  };

  const hasActiveFilters = query.trim() || Object.values(filters).some(v => v);

  return (
    <div className="advanced-search">
      <div className="search-header">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Try: 'high performers', 'needs attention', 'above 80%', or student name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="search-actions">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && <span className="badge">{Object.values(filters).filter(v => v).length}</span>}
          </button>
          <select
            className="search-mode-select"
            value={filters.searchMode}
            onChange={(e) => setFilters({ ...filters, searchMode: e.target.value })}
          >
            <option value="semantic">🧠 Semantic</option>
            <option value="exact">🔍 Exact</option>
            <option value="fuzzy">✨ Fuzzy</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Percentage Range</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.minPercentage}
                  onChange={(e) => setFilters({ ...filters, minPercentage: e.target.value })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.maxPercentage}
                  onChange={(e) => setFilters({ ...filters, maxPercentage: e.target.value })}
                />
              </div>
            </div>
            <div className="filter-group">
              <label>Pass Status</label>
              <select
                value={filters.passStatus}
                onChange={(e) => setFilters({ ...filters, passStatus: e.target.value })}
              >
                <option value="">All</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Attendance Range</label>
              <select
                value={filters.attendanceRange}
                onChange={(e) => setFilters({ ...filters, attendanceRange: e.target.value })}
              >
                <option value="">All</option>
                <option value="90-100">90-100%</option>
                <option value="80-89">80-89%</option>
                <option value="70-79">70-79%</option>
                <option value="0-69">Below 70%</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-secondary" onClick={clearFilters}>
              <X size={16} />
              Clear All
            </button>
            <button className="btn-primary" onClick={saveSearch}>
              <Sparkles size={16} />
              Save Search
            </button>
          </div>
        </div>
      )}

      <div className="search-results-header">
        <div className="results-count">
          <Users size={18} />
          <span>{filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found</span>
        </div>
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      {savedSearches.length > 0 && (
        <div className="saved-searches">
          <h4>Saved Searches</h4>
          <div className="saved-searches-list">
            {savedSearches.map(search => (
              <button
                key={search.id}
                className="saved-search-item"
                onClick={() => loadSearch(search)}
              >
                {search.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h4>Recent Searches</h4>
          <div className="history-list">
            {searchHistory.map((term, idx) => (
              <button
                key={idx}
                className="history-item"
                onClick={() => setQuery(term)}
              >
                <Search size={14} />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="search-results-list">
        {filteredStudents.length === 0 ? (
          <div className="empty-search-state">
            <Search size={48} />
            <p>No students found</p>
            <small>Try adjusting your search or filters</small>
          </div>
        ) : (
          <div className="results-grid">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="search-result-card"
                onClick={() => onSelectStudent && onSelectStudent(student)}
              >
                <div className="result-header">
                  <div className="result-avatar">
                    {student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="result-info">
                    <h4>{student.name}</h4>
                    <p>{student.department}</p>
                  </div>
                  {student._searchScore && (
                    <div className="search-score">
                      {student._searchScore}% match
                    </div>
                  )}
                </div>
                <div className="result-details">
                  <div className="detail-item">
                    <span className="label">Percentage:</span>
                    <span className="value">{student.percentage || 0}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Attendance:</span>
                    <span className="value">{student.attendance || 0}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${student.passStatus?.toLowerCase()}`}>
                      {student.passStatus}
                    </span>
                  </div>
                  {student.email && (
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value small">{student.email}</span>
                    </div>
                  )}
                </div>
                <div className="result-footer">
                  <span className="click-hint">Click to view details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {onApplyFilters && filteredStudents.length > 0 && (
        <div className="apply-filters-section">
          <button
            className="btn-primary apply-btn"
            onClick={() => onApplyFilters(filteredStudents)}
          >
            Apply Filters to View ({filteredStudents.length} students)
          </button>
        </div>
      )}
    </div>
  );
}

