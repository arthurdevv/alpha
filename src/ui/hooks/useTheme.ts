import { useEffect, useMemo, useState } from 'preact/hooks';

import type { Theme } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';

export const fixed = ['foreground', 'background', 'cursorColor', 'selectionBackground'];

export function useTheme() {
  const themeName = useAppStore(s => s.settings.theme);

  const [theme, setTheme] = useState<Partial<Theme>>({});

  useEffect(() => {
    if (!themeName) return;
    let cancelled = false;

    ipc.theme.load(themeName).then(t => {
      if (!cancelled) setTheme(t);
    });

    return () => {
      cancelled = true;
    };
  }, [themeName]);

  const colors = useMemo(() => {
    const dynamic = Object.keys(theme).filter(
      key => !fixed.includes(key) && !['name', 'background'].includes(key),
    );

    return [...fixed, ...dynamic];
  }, [theme]);

  return [theme, colors] as const;
}
