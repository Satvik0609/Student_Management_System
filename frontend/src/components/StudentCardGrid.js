import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const ProgressBar = ({ value }) => (
  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all"
      style={{ width: `${Math.min(100, value || 0)}%`, background: 'var(--primary)' }}
    ></div>
  </div>
);

const StudentCardGrid = ({
  data,
  selectedIds,
  onToggleSelect,
  onView,
  onEdit,
  onDeleteConfirm,
  idToRank,
  page,
  limit,
  total,
  onPageChange,
  onToggleSelectAll
}) => {
  const totalPages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total, limit]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-xl">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h4 className="m-0 text-lg font-semibold">Students (card view)</h4>
          <p className="m-0 text-sm text-gray-500 dark:text-gray-400">Tap a card to view richer context</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center rounded-full px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
            onClick={() => onToggleSelectAll(true)}
          >
            Select page
          </button>
          <button
            className="inline-flex items-center rounded-full px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
            onClick={() => onToggleSelectAll(false)}
          >
            Clear
          </button>
          <button
            className="inline-flex items-center rounded-full px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition text-sm disabled:opacity-50"
            disabled={selectedIds.length === 0}
            onClick={() => onDeleteConfirm(selectedIds)}
          >
            <Trash2 size={14} className="mr-1" /> Delete selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="p-5 text-center text-gray-500">No records in this page.</div>
      ) : (
        <div className="p-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((s) => {
            const rank = idToRank?.[s._id];
            const isSelected = selectedIds.includes(s._id);
            return (
              <div
                key={s._id}
                className={`rounded-2xl border border-gray-100 dark:border-white/10 bg-white/90 dark:bg-white/5 p-4 shadow-sm transition relative ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onToggleSelect(s._id, e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-lg text-gray-900 dark:text-white">{s.name}</div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-contrast text-primary-700 dark:text-primary-100">
                        Rank #{rank ?? '—'}
                      </span>
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {s.usn} • {s.department}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{s.percentage ?? 0}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Grade {s.grade}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className={`font-semibold ${s.passStatus === 'Pass' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {s.passStatus}
                        </div>
                        <div className="text-xs text-gray-500">CGPA {s.cgpa}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={s.percentage} />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Performance index</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      onClick={() => onView(s)}
                    >
                      <Eye size={14} className="mr-1" /> View
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      onClick={() => onEdit(s._id)}
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </button>
                  </div>
                  <button
                    className="inline-flex items-center text-rose-500 text-xs"
                    onClick={() => onDeleteConfirm([s._id])}
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            <div className="px-3 py-1.5 rounded-full bg-primary-contrast text-primary-700 dark:text-primary-100">
              Page {page} / {totalPages}
            </div>
            <button
              className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

StudentCardGrid.propTypes = {
  data: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  idToRank: PropTypes.object,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired
};

export default StudentCardGrid;


