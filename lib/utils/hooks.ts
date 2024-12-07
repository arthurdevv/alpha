import { type MutableRef, useEffect, useRef } from 'preact/hooks';

function useUpdate<T>(inputs: T, effect: (prev: T) => void): T | undefined {
  const ref: MutableRef<T | undefined> = useRef<T>();

  useEffect(() => {
    ref.current = inputs;

    if (ref.current) {
      effect(inputs);
    }
  }, [inputs]);

  return ref.current;
}

function usePrevious<T>(value: T): T | undefined {
  const ref: MutableRef<T | undefined> = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export { useUpdate, usePrevious };
