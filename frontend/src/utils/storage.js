const KEY = 'students-app-state-v1';

export const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, _savedAt: Date.now() }));
  } catch {
    // ignore
  }
};

export const clearState = () => {
  try { localStorage.removeItem(KEY); } catch {}
};


