import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { bulkDelete } from '../services/StudentService';
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';

const StudentList = ({
  data, total, page, limit,
  onPageChange,
  sortBy, sortOrder, onSortChange,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onEdit, onDeleteConfirm, onView,
  idToRank,
  recordText
}) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const allSelected = useMemo(() => data.length > 0 && data.every(s => selectedIds.includes(s._id)), [data, selectedIds]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white rounded-t-2xl">
        <h4 className="m-0 text-lg font-semibold">Students</h4>
        <div>
          <button className="inline-flex items-center rounded-md px-2 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 transition shadow-sm disabled:opacity-50" disabled={selectedIds.length === 0} onClick={onDeleteConfirm}>
            <Trash2 size={16} className="mr-1"/> Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>
      <div className="p-0">
        {data.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No students found. Add your first student!</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full align-middle">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-3 py-2 w-10">
                    <input type="checkbox" checked={allSelected} onChange={(e) => onToggleSelectAll(e.target.checked)} />
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('rank')} title="Sort by rank">Rank <ArrowUpDown size={14}/></th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('name')} title="Sort by name">Name <ArrowUpDown size={14}/></th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('usn')} title="Sort by USN">USN <ArrowUpDown size={14}/></th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('department')} title="Sort by department">Department <ArrowUpDown size={14}/></th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('percentage')} title="Sort by percentage">Percentage <ArrowUpDown size={14}/></th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedIds.includes(s._id)} onChange={(e) => onToggleSelect(s._id, e.target.checked)} />
                    </td>
                    <td className="px-3 py-2">{idToRank?.[s._id] ?? '-'}</td>
                    <td className="px-3 py-2 cursor-pointer font-semibold" onClick={() => onView(s)}>{s.name}</td>
                    <td className="px-3 py-2">{s.usn}</td>
                    <td className="px-3 py-2">{s.department}</td>
                    <td className="px-3 py-2">{s.percentage}%</td>
                    <td className="px-3 py-2">
                      <button className="inline-flex items-center rounded-md px-2 py-1 border border-blue-300 text-blue-700 hover:bg-blue-50 transition shadow-sm mr-2" onClick={() => onView(s)} title="View"><Eye size={16}/></button>
                      <button className="inline-flex items-center rounded-md px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm mr-2" onClick={() => onEdit(s._id)} title="Edit"><Pencil size={16}/></button>
                      <button className="inline-flex items-center rounded-md px-2 py-1 border border-red-300 text-red-700 hover:bg-red-50 transition shadow-sm" onClick={() => onDeleteConfirm([s._id])} title="Delete"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data.length > 0 && (
        <div className="px-4 py-3 border-t flex items-center justify-between rounded-b-2xl">
          <div className="text-sm text-gray-600">Showing {(page-1)*limit + 1}-{Math.min(page*limit, total)} of {total}</div>
          <div className="space-x-2">
            <button className="inline-flex items-center rounded-md px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
            <button className="inline-flex items-center rounded-md px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm disabled:opacity-50" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;

StudentList.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  idToRank: PropTypes.object,
  recordText: PropTypes.string
};