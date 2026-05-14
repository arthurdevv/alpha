import { useMemo, useState } from 'preact/hooks';

type Mappable = { id: string; name: string; group: string };

export function useSearch<T extends Record<string, string>>(schema: T | Mappable[]) {
  const [query, setQuery] = useState('');

  const normalized = useMemo<[string, string, string][]>(() => {
    if (Array.isArray(schema)) {
      return schema
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name, group }) => [id, name, group]);
    }

    return Object.entries(schema);
  }, [schema]);

  const filtered = useMemo(() => {
    if (!query.trim()) return normalized;

    const q = query.toLowerCase();
    return normalized.filter(([, label]) => label.toLowerCase().includes(q));
  }, [normalized, query]);

  return { query, setQuery, filtered, isEmpty: filtered.length === 0 };
}
