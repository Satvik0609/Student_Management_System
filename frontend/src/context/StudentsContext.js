import React, { createContext, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const StudentsContext = createContext();

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useLocalStorage('students', []);

  const add = (student) => setStudents((prev) => {
    const usn = String(student.usn || '').toUpperCase().trim();
    if (!usn) return prev;
    const idx = prev.findIndex((s) => s.usn === usn);
    const normalized = { ...student, usn };
    if (idx >= 0) {
      const next = prev.slice();
      next[idx] = { ...next[idx], ...normalized };
      return next;
    }
    return [...prev, normalized];
  });

  const update = (idOrUsn, patch) => setStudents((prev) => {
    const idx = prev.findIndex((s) => s._id === idOrUsn || s.id === idOrUsn || s.usn === idOrUsn);
    if (idx < 0) return prev;
    const next = prev.slice();
    next[idx] = { ...next[idx], ...patch };
    return next;
  });

  const remove = (id) => setStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
  const bulkRemove = (ids) => setStudents((prev) => prev.filter((s) => !ids.includes(s._id) && !ids.includes(s.id)));
  const clear = () => setStudents([]);
  const setAll = (list) => setStudents(list || []);

  const value = useMemo(() => ({ students, add, update, remove, bulkRemove, clear, setAll }), [students]);
  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>;
};

export const useStudentsContext = () => useContext(StudentsContext);


