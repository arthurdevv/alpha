import { useMemo, useState } from 'preact/hooks';

export function useSearch<T extends Record<string, string>>(schema: T) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const entries = Object.entries(schema);
    if (!query.trim()) return entries;

    const q = query.toLowerCase();
    return entries.filter(([, label]) => label.toLowerCase().includes(q));
  }, [schema, query]);

  return { query, setQuery, filtered, isEmpty: filtered.length === 0 };
}
