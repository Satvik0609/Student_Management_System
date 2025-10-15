import { useMemo } from 'react';

export default function useSearch(items, query) {
  return useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((s) => {
      return [
        s.name, s.usn, s.department, s.email, s.phone, s.gender, s.address,
        String(s.percentage ?? ''), String(s.grade ?? ''), String(s.passStatus ?? '')
      ].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [items, query]);
}


