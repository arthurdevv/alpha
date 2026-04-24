import { useEffect, useRef } from 'preact/hooks';

type StoreApi<T> = {
  getState: () => T;
};

export function useUnmountWithStore<T, K extends keyof T>(
  store: StoreApi<T>,
  key: K,
  onUnmount: (selected: T[K], state: T) => void,
) {
  const keyRef = useRef(key);
  const onUnmountRef = useRef(onUnmount);

  keyRef.current = key;
  onUnmountRef.current = onUnmount;

  useEffect(() => {
    return () => {
      const state = store.getState();
      const selected = state[keyRef.current];

      onUnmountRef.current(selected, state);
    };
  }, [store]);
}
