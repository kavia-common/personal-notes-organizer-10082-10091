/**
 * PUBLIC_INTERFACE
 * useDebounce
 * Returns a debounced value that updates after the specified delay.
 */
import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
