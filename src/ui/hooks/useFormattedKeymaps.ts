import { useMemo } from 'preact/hooks';

import type { Keymaps } from 'shared/types';
import { KEY_SYMBOLS } from 'ui/commands/keys';
import { useAppStore } from 'ui/store/app/store';

function formatKeyCombo(combo: string, join?: boolean): string | string[] {
  const keys = combo.split('+').map(key => KEY_SYMBOLS[key] ?? key);
  return join ? keys.join('+') : keys;
}

export function useFormattedKeymaps(command?: string): string[] | Keymaps {
  const keymaps = useAppStore(s => s.keymaps);

  const getFormattedCombos = (combos: string[] = [], flat = false) => {
    const formatted = combos.map(combo => formatKeyCombo(combo));
    return flat ? formatted.flat() : formatted;
  };

  return useMemo(() => {
    if (command) {
      return getFormattedCombos(keymaps[command], true);
    }

    const entries = Object.entries(keymaps).map(([command, combos]) => [
      command,
      getFormattedCombos(combos, true),
    ]);

    return Object.fromEntries(entries);
  }, [keymaps, command]);
}
