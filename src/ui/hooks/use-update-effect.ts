import { useEffect, useRef } from 'preact/hooks';
import type { EffectCallback } from 'preact/hooks';

export function useUpdateEffect(effect: EffectCallback, deps: any[]) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    return effect();
  }, deps);
}
