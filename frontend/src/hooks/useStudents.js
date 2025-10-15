import { useCallback, useMemo, useState } from 'react';

// Client-side students manager (for a client-only mode if backend is not required)
export default function useStudents(initial = []) {
  const [students, setStudents] = useState(initial);

  const upsert = useCallback((student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.usn === student.usn);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], ...student };
        return next;
      }
      return [...prev, student];
    });
  }, []);

  const removeByIds = useCallback((ids) => {
    setStudents((prev) => prev.filter((s) => !ids.includes(s.id || s._id)));
  }, []);

  const clearAll = useCallback(() => setStudents([]), []);

  const ranked = useMemo(() => students.slice().sort((a,b) => (b.percentage??0) - (a.percentage??0)), [students]);
  const idToRank = useMemo(() => Object.fromEntries(ranked.map((s, i) => [(s.id || s._id), i + 1])), [ranked]);

  return { students, setStudents, upsert, removeByIds, clearAll, idToRank };
}


