import { type EffectCallback, useEffect, useRef } from 'preact/hooks';

function useUpdateEffect(effect: EffectCallback, deps: any[]) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    return effect();
  }, deps);
}

export { useUpdateEffect };
