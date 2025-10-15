import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentDetailModal from './components/StudentDetailModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import Spinner from './components/Spinner';
// Keeping service imports for now; will migrate to context for client-only mode progressively
import { getStudents, deleteStudent, bulkDelete, clearAll, addStudent } from './services/StudentService';
import { StudentsProvider } from './context/StudentsContext';
import { Plus, Search, Trash2 } from 'lucide-react';
import DepartmentBadges, { DEPARTMENTS } from './components/DepartmentBadges';
import Dashboard from './components/Dashboard';
import FiltersPanel from './components/FiltersPanel';
import { exportCSV, exportJSON, importCSV, importJSON } from './utils/exportImport';
import { loadState, saveState, clearState } from './utils/storage';

function App() {
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch a large page to allow client-side filtering/ranking/export
      const data = await getStudents({ q, sortBy, sortOrder, page: 1, limit: 1000 });
      setAllItems(data.items || []);
      // Filtering and paging applied below
      setError('');
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [q]);

  // Apply filters, sorting, ranking, and pagination on client side
  useEffect(() => {
    const filtered = allItems
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
  }, [allItems, deptFilter, filters, sortBy, sortOrder, page, limit, showTop10, showFailed]);

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

  const openCreate = () => { setEditId(null); setFormOpen(true); };
  const openEdit = (id) => { setEditId(id); setFormOpen(true); };
  const openView = (s) => { setDetailStudent(s); setDetailOpen(true); };

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
      showToast('success', 'Import completed');
    } catch {
      showToast('error', 'Import failed');
    }
  };

  const onPrint = () => {
    window.print();
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

  return (
    <div className="container py-4">
      <div className="rounded-xl p-6 mb-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg">
        <h1 className="text-center mb-0 fw-semibold" style={{fontSize: 28}}>Student Record Management System</h1>
        <p className="text-center opacity-90 mt-2 mb-0">Manage records, analytics, and imports with a modern UI</p>
      </div>

      <div className="mb-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4 flex flex-wrap gap-2 items-center">
          <div className="flex items-center w-full sm:w-auto max-w-sm border border-gray-300 rounded-md overflow-hidden bg-white">
            <span className="px-2 text-gray-500"><Search size={16}/></span>
            <input id="global-search" className="flex-1 px-2 py-2 outline-none" placeholder="Search by any field" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white" style={{ maxWidth: 260 }} value={deptFilter} onChange={(e) => { setPage(1); setDeptFilter(e.target.value); }}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="inline-flex items-center rounded-md bg-primary-600 text-white px-3 py-2 hover:bg-primary-700 transition shadow-sm" onClick={openCreate}><Plus size={16} className="mr-1"/> Add Student</button>
          <button className={`inline-flex items-center rounded-md px-3 py-2 transition shadow-sm ${showTop10 ? 'bg-gray-200 text-gray-900' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`} onClick={() => { setShowTop10((v) => !v); setPage(1); }} title="Toggle Top 10">Top 10</button>
          <button className={`inline-flex items-center rounded-md px-3 py-2 transition shadow-sm ${showFailed ? 'bg-gray-200 text-gray-900' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`} onClick={() => { setShowFailed((v) => !v); setPage(1); }} title="Show only failed">Failed</button>
          <input type="file" className="px-3 py-2 border border-gray-300 rounded-md bg-white" style={{ maxWidth: 260 }} accept=".csv,.json" onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])} />
          <button className="inline-flex items-center rounded-md px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm" onClick={onExportCSV}>Export CSV</button>
          <button className="inline-flex items-center rounded-md px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm" onClick={onExportJSON}>Export JSON</button>
          <button className="inline-flex items-center rounded-md px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm" onClick={onPrint}>Print</button>
          <button className="ml-auto inline-flex items-center rounded-md px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm disabled:opacity-50" disabled={!lastDeleted} onClick={undoDelete}>Undo Delete</button>
          <button className="inline-flex items-center rounded-md px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 transition shadow-sm" onClick={confirmClearAll}><Trash2 size={16} className="mr-1"/> Clear All</button>
        </div>
        <div className="px-4 py-3 border-t flex flex-wrap gap-2 items-center bg-white/50 rounded-b-2xl">
          <div className="w-full mb-2">
            <DepartmentBadges items={allItems} />
          </div>
          <div className="ml-auto text-sm text-gray-500">{savedAt ? `Last saved: ${new Date(savedAt).toLocaleTimeString()}` : ''}</div>
        </div>
      </div>

      <FiltersPanel filters={filters} setFilters={setFilters} onClear={() => setFilters({ departments: [], grades: [], passFail: '', minMarks: 0, maxMarks: 100 })} />

      {/* Dashboard */}
      {!loading && !error && <Dashboard items={items} />}

      {/* Controls row */}
      {loading ? (
        <Spinner text="Loading students..." />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
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
          onEdit={openEdit}
          onDeleteConfirm={(ids) => confirmDelete(ids)}
          onView={openView}
          idToRank={idToRank}
        />
      )}

      <StudentForm open={formOpen} onClose={() => setFormOpen(false)} refreshStudents={fetchStudents} editId={editId} />
      <StudentDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} student={detailStudent} />
      <ConfirmDialog open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirm}
        title="Are you sure?" message={confirmIds[0] === '__CLEAR_ALL__' ? 'This will remove all students permanently.' : 'This action cannot be undone.'}
        confirmText="Yes, Delete" />
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      {/* Scroll to top */}
      <button
        className="btn btn-primary shadow-lg"
        style={{ position: 'fixed', bottom: 24, right: 24, borderRadius: 9999 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to top"
      >↑</button>
    </div>
  );
}

export default function AppWithProviders() {
  return (
    <StudentsProvider>
      <App />
    </StudentsProvider>
  );
}