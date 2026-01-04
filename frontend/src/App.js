import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentDetailModal from './components/StudentDetailModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import Spinner from './components/Spinner';
// Keeping service imports for now; will migrate to context for client-only mode progressively
import { getStudents, deleteStudent, bulkDelete, clearAll, addStudent, updateStudent } from './services/StudentService';
import { StudentsProvider } from './context/StudentsContext';
import { Plus, Search, Trash2, Users2, Bell, LogOut, User, Shield } from 'lucide-react';
import DepartmentBadges, { DEPARTMENTS } from './components/DepartmentBadges';
import Dashboard from './components/Dashboard';
import FiltersPanel from './components/FiltersPanel';
import { exportCSV, exportJSON, importCSV, importJSON } from './utils/exportImport';
import { loadState, saveState } from './utils/storage';
import ThemeToggle from './components/ThemeToggle';
import StudentCardGrid from './components/StudentCardGrid';
import ActivityFeed from './components/ActivityFeed';
import FeatureTabs from './components/FeatureTabs';
import FeedbackPanel from './components/FeedbackPanel';
import CompareStudentsModal from './components/CompareStudentsModal';
import AttendancePanel from './components/AttendancePanel';
import PerformanceTrends from './components/PerformanceTrends';
import PresenceIndicator from './components/PresenceIndicator';
import LiveActivityFeed from './components/LiveActivityFeed';
import NotificationBell from './components/NotificationBell';
import InstallPrompt from './components/InstallPrompt';
import StrategyLab from './components/StrategyLab';
import CohortPulse from './components/CohortPulse';
import SpotlightCarousel from './components/SpotlightCarousel';
import DailyBrief from './components/DailyBrief';
import ActionTicker from './components/ActionTicker';
import AIInsights from './components/AIInsights';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import VisualizationStudio from './components/VisualizationStudio';
import SmartRecommendations from './components/SmartRecommendations';
import StudentTimeline from './components/StudentTimeline';
import DataQualityDashboard from './components/DataQualityDashboard';
import QuickActions from './components/QuickActions';
import AdvancedSearch from './components/AdvancedSearch';
import BulkOperations from './components/BulkOperations';
import ActivityLog from './components/ActivityLog';
import StudentComparison from './components/StudentComparison';
import PerformanceInsights from './components/PerformanceInsights';
import AttendanceHeatmap from './components/AttendanceHeatmap';
import { useCollaboration } from './context/CollaborationContext';
import { useAuth } from './context/AuthContext';
import { getAttendancePct } from './utils/attendance';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { activeUsers, addActivity, addNotification, currentUser } = useCollaboration();
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmIds, setConfirmIds] = useState([]);

  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const showToast = (type, message) => setToast({ show: true, type, message });

  const [selectedIds, setSelectedIds] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [filters, setFilters] = useState({ departments: [], grades: [], passFail: '', minMarks: 0, maxMarks: 100 });
  const [savedAt, setSavedAt] = useState(null);
  const [showTop10, setShowTop10] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [idToRank, setIdToRank] = useState({});
  const [fullCount, setFullCount] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const featureTabs = useMemo(() => {
    const allTabs = [
      { id: 'records', label: 'Records', description: 'CRUD, filters, exports', roles: ['admin', 'teacher', 'student'] },
      { id: 'advanced-search', label: 'Advanced Search', description: 'Semantic & fuzzy search', roles: ['admin', 'teacher', 'student'] },
      { id: 'bulk-operations', label: 'Bulk Operations', description: 'Batch updates & imports', roles: ['admin', 'teacher'] },
      { id: 'comparison', label: 'Compare', description: 'Side-by-side comparison', roles: ['admin', 'teacher', 'student'] },
      { id: 'activity-log', label: 'Activity Log', description: 'Audit trail & history', roles: ['admin', 'teacher'] },
      { id: 'performance-insights', label: 'Performance Insights', description: 'Analytics dashboard', roles: ['admin', 'teacher', 'student'] },
      { id: 'attendance-heatmap', label: 'Attendance Heatmap', description: 'Visual attendance patterns', roles: ['admin', 'teacher'] },
      { id: 'recommendations', label: 'Recommendations', description: 'AI-powered suggestions', roles: ['admin', 'teacher', 'student'] },
      { id: 'timeline', label: 'Timeline', description: 'Activity & journey tracking', roles: ['admin', 'teacher', 'student'] },
      { id: 'quality', label: 'Data Quality', description: 'Validation & scoring', roles: ['admin', 'teacher'] },
      { id: 'quick-actions', label: 'Quick Actions', description: 'Context shortcuts', roles: ['admin', 'teacher', 'student'] },
      { id: 'analytics', label: 'Analytics', description: 'KPIs & charts', roles: ['admin', 'teacher', 'student'] },
      { id: 'ai', label: 'AI Insights', description: 'Natural language queries', roles: ['admin', 'teacher', 'student'] },
      { id: 'predictive', label: 'Predictive', description: 'ML-powered forecasts', roles: ['admin', 'teacher', 'student'] },
      { id: 'visualization', label: 'Visualization', description: 'Advanced charts', roles: ['admin', 'teacher', 'student'] },
      { id: 'lab', label: 'Strategy Lab', description: 'Playbooks & experiments', roles: ['admin', 'teacher'] },
      { id: 'attendance', label: 'Attendance', description: 'Daily tracker', roles: ['admin', 'teacher'] },
      { id: 'performance', label: 'Performance', description: 'Trends over time', roles: ['admin', 'teacher', 'student'] }
    ];
    return allTabs.filter(tab => !tab.roles || hasRole(tab.roles));
  }, [user, hasRole]);
  const [activePanel, setActivePanel] = useState(() => {
    const defaultTab = featureTabs.find(tab => tab.id === 'records') || featureTabs[0];
    return defaultTab?.id || 'records';
  });
  
  // Update activePanel if current tab is no longer available
  useEffect(() => {
    if (!featureTabs.find(tab => tab.id === activePanel)) {
      const defaultTab = featureTabs.find(tab => tab.id === 'records') || featureTabs[0];
      if (defaultTab) setActivePanel(defaultTab.id);
    }
  }, [featureTabs, activePanel]);
  const importInputRef = useRef(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sr-attendance') || '{}');
    } catch {
      return {};
    }
  });

  const heroStats = useMemo(() => {
    const totalStudents = allItems.length;
    if (!totalStudents) {
      return { total: 0, avg: 0, passRate: 0, failCount: 0 };
    }
    const avg = allItems.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalStudents;
    const passCount = allItems.filter((s) => s.passStatus === 'Pass').length;
    const passRate = (passCount / totalStudents) * 100;
    return {
      total: totalStudents,
      avg: Number(avg.toFixed(1)),
      passRate: Number(passRate.toFixed(1)),
      failCount: totalStudents - passCount
    };
  }, [allItems]);

  const computeAttendancePct = useCallback((studentId) => getAttendancePct(attendanceData, studentId), [attendanceData]);

  const dynamicFeedback = useMemo(() => ([
    {
      id: 'selection-status',
      label: `${selectedIds.length} student(s) selected`,
      description: 'Pick 2-4 students and hit Compare for radar insights.',
      icon: <Users2 size={18} />,
      tone: selectedIds.length >= 2 ? 'success' : 'info'
    },
    {
      id: 'attendance-records',
      label: `${Object.keys(attendanceData).length} attendance records`,
      description: 'Update daily attendance from the Attendance tab.',
      icon: <Bell size={18} />,
      tone: 'info'
    }
  ]), [selectedIds, attendanceData]);

  const compareSelection = useMemo(() => {
    const selected = allItems.filter((student) => selectedIds.includes(student._id));
    const decorated = selected.slice(0, 4).map((student) => ({
      ...student,
      attendancePct: computeAttendancePct(student._id)
    }));
    return { list: decorated, total: selected.length };
  }, [allItems, selectedIds, computeAttendancePct]);

  const compareDisabled = compareSelection.total < 2 || compareSelection.total > 4;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch a large page to allow client-side filtering/ranking/export
      const data = await getStudents({ q: '', sortBy, sortOrder, page: 1, limit: 1000 });
      setAllItems(data.items || []);
      // Filtering and paging applied below
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to fetch students. Please check if the backend server is running.');
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters, sorting, ranking, and pagination on client side
  useEffect(() => {
    const searchLower = q.toLowerCase().trim();
    const filtered = allItems
      .filter((s) => {
        // Search filter - search across name, USN, department, email, phone
        if (searchLower) {
          const searchable = [
            s.name || '',
            s.usn || '',
            s.department || '',
            s.email || '',
            s.phone || '',
            String(s.percentage || ''),
            s.grade || '',
            s.passStatus || ''
          ].map(v => String(v).toLowerCase());
          if (!searchable.some(v => v.includes(searchLower))) {
            return false;
          }
        }
        return true;
      })
      .filter((s) => !deptFilter || s.department === deptFilter)
      .filter((s) => filters.departments.length === 0 || filters.departments.includes(s.department))
      .filter((s) => filters.grades.length === 0 || filters.grades.includes(s.grade))
      .filter((s) => !filters.passFail || s.passStatus === filters.passFail)
      .filter((s) => (s.percentage ?? 0) >= (filters.minMarks ?? 0) && (s.percentage ?? 0) <= (filters.maxMarks ?? 100))
      .filter((s) => (showFailed ? s.passStatus === 'Fail' : true))
      .sort((a, b) => {
        const dir = sortOrder === 'asc' ? 1 : -1;
        let av = a[sortBy];
        let bv = b[sortBy];
        if (sortBy === 'rank') {
          av = (b.percentage ?? 0);
          bv = (a.percentage ?? 0);
        }
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    const ranked = filtered.slice().sort((a,b) => (b.percentage??0) - (a.percentage??0));
    const idToRankMap = Object.fromEntries(ranked.map((s, idx) => [s._id, idx + 1]));
    const list = showTop10 ? ranked.slice(0, 10) : filtered;
    const start = (page - 1) * limit;
    const pageItems = list.slice(start, start + limit);
    setItems(pageItems);
    setTotal(list.length);
    setFullCount(list.length);
    setIdToRank(idToRankMap);
  }, [allItems, q, deptFilter, filters, sortBy, sortOrder, page, limit, showTop10, showFailed]);

  // Persistence
  useEffect(() => {
    const st = loadState();
    if (st) {
      setQ(st.q || '');
      setSortBy(st.sortBy || 'createdAt');
      setSortOrder(st.sortOrder || 'desc');
      setDeptFilter(st.deptFilter || '');
      setFilters(st.filters || { departments: [], grades: [], passFail: '', minMarks: 0, maxMarks: 100 });
      setSavedAt(st._savedAt || null);
    }
  }, []);
  useEffect(() => {
    saveState({ q, sortBy, sortOrder, deptFilter, filters });
    setSavedAt(Date.now());
  }, [q, sortBy, sortOrder, deptFilter, filters]);

  useEffect(() => {
    localStorage.setItem('sr-attendance', JSON.stringify(attendanceData));
  }, [attendanceData]);

  const onSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const onToggleSelect = (id, checked) => {
    setSelectedIds((prev) => checked ? [...new Set([...prev, id])] : prev.filter(x => x !== id));
  };
  const onToggleSelectAll = (checked) => {
    setSelectedIds(checked ? items.map(i => i._id) : []);
  };

  const openCreate = () => {
    setEditId(null);
    setFormOpen(true);
    addActivity({ type: 'student-added', message: 'opened add student form' });
  };
  const openEdit = (id) => {
    setEditId(id);
    setFormOpen(true);
    const student = allItems.find(s => s._id === id);
    addActivity({ type: 'student-edited', message: `started editing ${student?.name || 'student'}` });
  };
  const openView = (s) => {
    setDetailStudent(s);
    setDetailOpen(true);
    addActivity({ type: 'view', message: `viewed ${s.name}'s details` });
  };

  const confirmDelete = (ids) => { setConfirmIds(ids?.length ? ids : selectedIds); setConfirmOpen(true); };
  const doDelete = async () => {
    setConfirmOpen(false);
    try {
      const toDelete = confirmIds[0] === '__CLEAR_ALL__' ? [] : allItems.filter(s => confirmIds.includes(s._id));
      if (confirmIds.length === 1) {
        await deleteStudent(confirmIds[0]);
      } else if (confirmIds.length > 1) {
        await bulkDelete(confirmIds);
      }
      setLastDeleted(toDelete);
      setSelectedIds([]);
      await fetchStudents();
      addActivity({ type: 'student-deleted', message: `deleted ${confirmIds.length} student(s)` });
      addNotification({ title: 'Students Deleted', message: `${confirmIds.length} student(s) removed successfully` });
      showToast('success', 'Deleted successfully');
    } catch {
      showToast('error', 'Delete failed');
    }
  };

  const confirmClearAll = () => { setConfirmIds(['__CLEAR_ALL__']); setConfirmOpen(true); };
  const handleConfirm = async () => {
    if (confirmIds[0] === '__CLEAR_ALL__') {
      try {
        await clearAll();
        setSelectedIds([]);
        await fetchStudents();
        showToast('success', 'All records cleared');
      } catch {
        showToast('error', 'Clear all failed');
      } finally {
        setConfirmOpen(false);
      }
    } else {
      await doDelete();
    }
  };

  // Import/export/print
  const onExportCSV = () => exportCSV(allItems);
  const onExportJSON = () => exportJSON(allItems);
  const onImportFile = async (file) => {
    try {
      const isJSON = file.name.toLowerCase().endsWith('.json');
      const data = isJSON ? await importJSON(file) : await importCSV(file);
      for (const s of data) {
        try { await addStudent(s); } catch {}
      }
      await fetchStudents();
      addActivity({ type: 'import', message: `imported ${data.length} students` });
      addNotification({ title: 'Import Complete', message: `Successfully imported ${data.length} students` });
      showToast('success', 'Import completed');
    } catch {
      showToast('error', 'Import failed');
    }
  };

  const onPrint = () => {
    window.print();
  };

  const downloadJSON = useCallback((filename, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleAttendanceMark = (studentId, date, value) => {
    if (studentId === 'EXPORT_REPORT') {
      const report = allItems.map((student) => ({
        name: student.name,
        department: student.department,
        attendance: computeAttendancePct(student._id)
      }));
      downloadJSON('attendance-report.json', { generatedAt: new Date().toISOString(), report });
      return;
    }
    setAttendanceData((prev) => {
      const next = { ...prev };
      next[studentId] = { ...(next[studentId] || {}), [date]: value };
      return next;
    });
  };


  // Undo delete
  const undoDelete = async () => {
    if (!lastDeleted || lastDeleted.length === 0) return;
    try {
      for (const s of lastDeleted) {
        const { _id, createdAt, updatedAt, totalMarks, percentage, grade, cgpa, passStatus, ...rest } = s;
        await addStudent(rest);
      }
      await fetchStudents();
      showToast('success', 'Undo successful');
      setLastDeleted(null);
    } catch {
      showToast('error', 'Undo failed');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { e.preventDefault(); openCreate(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
      if (e.key === 'Escape') { setFormOpen(false); setDetailOpen(false); setConfirmOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleImportClick = () => importInputRef.current?.click();
  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    addActivity({ type: 'logout', message: 'signed out' });
  };

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div>
          <div className="sidebar-brand">
            <div className="sidebar-badge">SRMS Pro</div>
            <p>Student Records Command Center</p>
          </div>
          <nav className="sidebar-nav">
            {featureTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activePanel === tab.id ? 'is-active' : ''}
                onClick={() => setActivePanel(tab.id)}
                title={tab.description}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-stats">
          <div>
            <p className="sidebar-label">Students</p>
            <p className="sidebar-value">{heroStats.total}</p>
          </div>
          <div>
            <p className="sidebar-label">Average %</p>
            <p className="sidebar-value">{heroStats.avg}%</p>
          </div>
          <div>
            <p className="sidebar-label">Pass rate</p>
            <p className="sidebar-value">{heroStats.passRate}%</p>
          </div>
        </div>
        <div className="sidebar-user-profile">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              <User size={20} />
            </div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
              <div className="sidebar-user-role">
                <Shield size={12} />
                {user?.role || 'student'}
              </div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
        <div className="sidebar-actions">
          <div className="sidebar-header-actions">
            <NotificationBell />
            <ThemeToggle />
          </div>
          {hasRole(['admin', 'teacher']) && (
            <button className="sidebar-primary" onClick={openCreate}>
              <Plus size={16} />
              New student
            </button>
          )}
          {hasRole(['admin', 'teacher']) && (
            <>
              <button className="sidebar-secondary" onClick={onExportCSV}>Export CSV</button>
              <button className="sidebar-secondary" onClick={onExportJSON}>Export JSON</button>
            </>
          )}
        </div>
              <PresenceIndicator users={activeUsers} />
              <LiveActivityFeed maxItems={8} />
              <ActivityFeed items={allItems} />
      </aside>

      <main className="app-shell__content">
        <section className="section-block glass-panel">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[220px]">
              <p className="section-eyebrow">Student success cockpit</p>
              <h1 className="section-title">Student Record Intelligence Hub</h1>
              <p className="section-subtitle">
                Track cohorts, uncover insights, and export clean data from a single polished workspace.
              </p>
              <div className="overview-pills">
                <span>Total {heroStats.total}</span>
                <span>Avg {heroStats.avg}%</span>
                <span>Pass {heroStats.passRate}%</span>
                <span className="text-rose-400">Fail {heroStats.failCount}</span>
              </div>
            </div>
          </div>
          <div className="hero-upgrades">
            <CohortPulse
              students={allItems}
              attendanceData={attendanceData}
              lastSavedAt={savedAt}
            />
            <SpotlightCarousel
              students={allItems}
              attendanceData={attendanceData}
              onSelect={openView}
            />
          </div>
          <DailyBrief students={allItems} attendanceData={attendanceData} />
          <ActionTicker students={allItems} attendanceData={attendanceData} />
          <div className="action-dock">
            {hasRole(['admin', 'teacher']) && (
              <button className="primary" onClick={openCreate}><Plus size={16}/> Add student</button>
            )}
            {hasRole(['admin', 'teacher']) && (
              <>
                <button onClick={handleImportClick}>Import (.csv/.json)</button>
                <button onClick={onExportCSV}>Export CSV</button>
                <button onClick={onExportJSON}>Export JSON</button>
              </>
            )}
            <button onClick={onPrint}>Print</button>
            {hasRole(['admin', 'teacher']) && (
              <>
                <button disabled={!lastDeleted} onClick={undoDelete}>Undo delete</button>
                {hasRole(['admin']) && (
                  <button className="danger" onClick={confirmClearAll}><Trash2 size={16}/> Clear all</button>
                )}
              </>
            )}
            <input ref={importInputRef} type="file" className="hidden-input" accept=".csv,.json" onChange={onFileInputChange} />
          </div>

          <FeatureTabs tabs={featureTabs} active={activePanel} onChange={setActivePanel} />
          <FeedbackPanel extraItems={dynamicFeedback} />
        </section>

        {activePanel === 'records' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Records</p>
                <h2>Search, filter, and manage students</h2>
              </div>
              <span className="section-meta">{savedAt ? `Last saved ${new Date(savedAt).toLocaleTimeString()}` : 'Autosave active'}</span>
            </header>

            <div className="control-bar">
              <div className="search-field">
                <span className="icon"><Search size={16}/></span>
                <input id="global-search" placeholder="Search name, USN, department..." value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
              </div>
              <select value={deptFilter} onChange={(e) => { setPage(1); setDeptFilter(e.target.value); }}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <button className={showTop10 ? 'active' : ''} onClick={() => { setShowTop10((v) => !v); setPage(1); }}>Top 10</button>
              <button className={showFailed ? 'active' : ''} onClick={() => { setShowFailed((v) => !v); setPage(1); }}>Failed only</button>
              {hasRole(['admin', 'teacher']) && selectedIds.length > 0 && (
                <button className="danger" onClick={() => confirmDelete(selectedIds)}>
                  <Trash2 size={16} />
                  Delete ({selectedIds.length})
                </button>
              )}
            </div>

            <DepartmentBadges items={allItems} />
            <FiltersPanel filters={filters} setFilters={setFilters} onClear={() => setFilters({ departments: [], grades: [], passFail: '', minMarks: 0, maxMarks: 100 })} />

            <div className="floating-toolbar flex gap-2 mb-3">
              <button
                className={`px-4 py-2 border text-sm ${viewMode === 'table' ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'border-gray-300 text-gray-600 bg-white'}`}
                onClick={() => setViewMode('table')}
              >
                Table view
              </button>
              <button
                className={`px-4 py-2 border text-sm ${viewMode === 'cards' ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'border-gray-300 text-gray-600 bg-white'}`}
                onClick={() => setViewMode('cards')}
              >
                Card view
              </button>
              {hasRole(['admin', 'teacher']) && (
                <button
                  className="px-4 py-2 border text-sm border-gray-300 text-gray-600 bg-white disabled:opacity-50"
                  disabled={compareDisabled}
                  onClick={() => setCompareOpen(true)}
                >
                  Compare ({compareSelection.total || 0})
                </button>
              )}
            </div>

            {loading ? (
              <Spinner text="Loading students..." />
            ) : error ? (
              <div className="alert alert-danger">
                {error}
                <br />
                <small className="text-muted">Make sure the backend server is running on http://localhost:5000</small>
              </div>
            ) : items.length === 0 && allItems.length === 0 ? (
              <div className="alert alert-info text-center py-4">
                <p className="mb-2">No students found.</p>
                {hasRole(['admin', 'teacher']) && (
                  <button className="btn btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Add your first student
                  </button>
                )}
              </div>
            ) : viewMode === 'cards' ? (
              <StudentCardGrid
                data={items}
                total={total}
                page={page}
                limit={limit}
                onPageChange={setPage}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onToggleSelectAll={onToggleSelectAll}
                onEdit={hasRole(['admin', 'teacher']) ? openEdit : undefined}
                onDeleteConfirm={hasRole(['admin', 'teacher']) ? ((ids) => confirmDelete(ids)) : undefined}
                onView={openView}
                idToRank={idToRank}
              />
            ) : (
              <StudentList
                data={items}
                total={total}
                page={page}
                limit={limit}
                onPageChange={setPage}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onToggleSelectAll={onToggleSelectAll}
                onEdit={hasRole(['admin', 'teacher']) ? openEdit : undefined}
                onDeleteConfirm={hasRole(['admin', 'teacher']) ? ((ids) => confirmDelete(ids)) : undefined}
                onView={openView}
                idToRank={idToRank}
              />
            )}
          </section>
        )}

        {activePanel === 'recommendations' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Smart Recommendations</p>
                <h2>AI-powered suggestions</h2>
              </div>
            </header>
            <SmartRecommendations
              students={allItems}
              attendanceData={attendanceData}
              onAction={(rec) => {
                if (rec.tab) setActivePanel(rec.tab);
                if (rec.filter) {
                  if (rec.filter === 'failed') setShowFailed(true);
                  if (rec.filter === 'low-attendance') setActivePanel('attendance');
                }
              }}
            />
          </section>
        )}

        {activePanel === 'timeline' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Student Timeline</p>
                <h2>Activity & journey tracking</h2>
              </div>
            </header>
            <StudentTimeline
              students={allItems}
              attendanceData={attendanceData}
              onSelectStudent={(student) => {
                setDetailStudent(student);
                setDetailOpen(true);
              }}
            />
          </section>
        )}

        {activePanel === 'quality' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Data Quality</p>
                <h2>Automated validation & scoring</h2>
              </div>
            </header>
            <DataQualityDashboard students={allItems} attendanceData={attendanceData} />
          </section>
        )}

        {activePanel === 'quick-actions' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Quick Actions</p>
                <h2>Context-sensitive shortcuts</h2>
              </div>
            </header>
            <QuickActions
              students={allItems}
              onAction={(action) => {
                if (action.type === 'import') handleImportClick();
                if (action.type === 'export') onExportJSON();
                if (action.type === 'analytics') setActivePanel('analytics');
                if (action.type === 'predictive') setActivePanel('predictive');
                if (action.type === 'visualization') setActivePanel('visualization');
                if (action.type === 'search') document.getElementById('global-search')?.focus();
                if (action.filter === 'failed') setShowFailed(true);
              }}
            />
          </section>
        )}

        {activePanel === 'analytics' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Analytics</p>
                <h2>KPIs & cohort trends</h2>
              </div>
            </header>
            {loading ? (
              <Spinner text="Loading analytics..." />
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : allItems.length === 0 ? (
              <div className="alert alert-info">No student data available. Add students to see analytics.</div>
            ) : (
              <Dashboard items={allItems} />
            )}
          </section>
        )}

        {activePanel === 'ai' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">AI-Powered</p>
                <h2>Natural language insights</h2>
              </div>
            </header>
            <AIInsights students={allItems} attendanceData={attendanceData} />
          </section>
        )}

        {activePanel === 'predictive' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Machine Learning</p>
                <h2>Predictive analytics & forecasts</h2>
              </div>
            </header>
            <PredictiveAnalytics students={allItems} attendanceData={attendanceData} />
          </section>
        )}

        {activePanel === 'visualization' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Data Visualization</p>
                <h2>Advanced charting studio</h2>
              </div>
            </header>
            <VisualizationStudio
              students={allItems}
              attendanceData={attendanceData}
              onExport={(filename, payload) => downloadJSON(filename, payload)}
            />
          </section>
        )}

        {activePanel === 'attendance' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Attendance</p>
                <h2>Daily tracker & calendar</h2>
              </div>
            </header>
            <AttendancePanel students={allItems} attendance={attendanceData} onMark={handleAttendanceMark} />
          </section>
        )}

        {activePanel === 'performance' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Performance</p>
                <h2>Marks across semesters</h2>
              </div>
            </header>
            <PerformanceTrends students={allItems} />
          </section>
        )}

        {activePanel === 'lab' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Experimentation</p>
                <h2>Strategy lab & playbooks</h2>
              </div>
            </header>
            <StrategyLab
              students={allItems}
              attendanceData={attendanceData}
              onExportPlan={(filename, payload) => downloadJSON(filename, payload)}
            />
          </section>
        )}

        {activePanel === 'advanced-search' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Search & Discovery</p>
                <h2>Advanced Search with Semantic Intelligence</h2>
              </div>
            </header>
            <AdvancedSearch
              students={allItems}
              onSelectStudent={(student) => {
                setDetailStudent(student);
                setDetailOpen(true);
              }}
              onApplyFilters={(filtered) => {
                // Apply filters to main view
                console.log('Applying filters to', filtered.length, 'students');
              }}
            />
          </section>
        )}

        {activePanel === 'bulk-operations' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Batch Processing</p>
                <h2>Bulk Operations & Mass Updates</h2>
              </div>
            </header>
            <BulkOperations
              students={allItems}
              onBulkUpdate={async (ids, updates) => {
                try {
                  const promises = ids.map(id => {
                    const student = allItems.find(s => s._id === id);
                    if (!student) return Promise.resolve();
                    return updateStudent(id, { ...student, ...updates });
                  });
                  await Promise.all(promises);
                  await fetchStudents();
                  setToast({ show: true, type: 'success', message: `Updated ${ids.length} student(s) successfully` });
                  return { success: true, message: `Updated ${ids.length} student(s)` };
                } catch (error) {
                  setToast({ show: true, type: 'error', message: error.message });
                  return { success: false, message: error.message };
                }
              }}
              onBulkDelete={async (ids) => {
                try {
                  await bulkDelete(ids);
                  await fetchStudents();
                  setToast({ show: true, type: 'success', message: `Deleted ${ids.length} student(s) successfully` });
                  return { success: true, message: `Deleted ${ids.length} student(s)` };
                } catch (error) {
                  setToast({ show: true, type: 'error', message: error.message });
                  return { success: false, message: error.message };
                }
              }}
              onBulkImport={async (data) => {
                try {
                  const promises = data.map(student => addStudent(student));
                  await Promise.all(promises);
                  await fetchStudents();
                  setToast({ show: true, type: 'success', message: `Imported ${data.length} student(s) successfully` });
                  return { success: true, message: `Imported ${data.length} student(s)` };
                } catch (error) {
                  setToast({ show: true, type: 'error', message: error.message });
                  return { success: false, message: error.message };
                }
              }}
            />
          </section>
        )}

        {activePanel === 'comparison' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Analysis</p>
                <h2>Student Comparison Tool</h2>
              </div>
            </header>
            <StudentComparison students={allItems} />
          </section>
        )}

        {activePanel === 'activity-log' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Audit & Compliance</p>
                <h2>Activity Log & Audit Trail</h2>
              </div>
            </header>
            <ActivityLog
              activities={allItems.map((student, idx) => ({
                id: student._id,
                type: 'update',
                user: user?.name || 'System',
                description: `Student record: ${student.name}`,
                target: student.name,
                timestamp: student.updatedAt || student.createdAt || new Date().toISOString(),
                changes: {},
                ip: '127.0.0.1'
              }))}
              currentUser={user}
            />
          </section>
        )}

        {activePanel === 'performance-insights' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Analytics</p>
                <h2>Performance Insights Dashboard</h2>
              </div>
            </header>
            <PerformanceInsights
              students={allItems}
              attendanceData={attendanceData}
            />
          </section>
        )}

        {activePanel === 'attendance-heatmap' && (
          <section className="section-block">
            <header className="section-header">
              <div>
                <p className="section-eyebrow">Visualization</p>
                <h2>Attendance Heatmap</h2>
              </div>
            </header>
            <AttendanceHeatmap
              students={allItems}
              attendanceData={attendanceData}
            />
          </section>
        )}

        <StudentForm open={formOpen} onClose={() => setFormOpen(false)} refreshStudents={fetchStudents} editId={editId} />
        <StudentDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} student={detailStudent} />
        <CompareStudentsModal open={compareOpen} onClose={() => setCompareOpen(false)} students={compareSelection?.list || []} />
        <ConfirmDialog open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirm}
          title="Are you sure?" message={confirmIds[0] === '__CLEAR_ALL__' ? 'This will remove all students permanently.' : 'This action cannot be undone.'}
          confirmText="Yes, Delete" />
        <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      </main>
    </div>
  );
}

// Extract main content to separate component for routing
function AppContent() {
  return (
    <StudentsProvider>
      <App />
    </StudentsProvider>
  );
}

export default function AppRouter() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}