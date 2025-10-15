import { useCallback, useEffect, useState } from 'react';

// Generic localStorage hook that namespaces keys and handles JSON parsing/stringifying
export default function useLocalStorage(key, initialValue) {
  const prefixedKey = `srms:${key}`;
  const read = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(prefixedKey);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  }, [prefixedKey, initialValue]);

  const [value, setValue] = useState(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch {
      // ignore quota failures
    }
  }, [prefixedKey, value]);

  const clear = useCallback(() => {
    try { window.localStorage.removeItem(prefixedKey); } catch {}
    setValue(initialValue);
  }, [prefixedKey, initialValue]);

  return [value, setValue, clear];
}


