import { cloneDeepWith, isPlainObject, transform } from 'lodash';

export function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

export function onSearch({ currentTarget }) {
  const {
    value,
    parentElement: { parentElement },
  } = currentTarget;

  const lists: HTMLElement[] = parentElement.querySelectorAll('ul');

  lists.forEach(element => {
    const items = element.querySelectorAll('li[data-name]');

    let count = 0;

    items.forEach(item => {
      const name = (item as any).dataset.name?.toLowerCase();

      const isVisible = name && name.includes(value.toLowerCase());

      (item as HTMLElement).style.display = isVisible ? 'flex' : 'none';

      if (isVisible) count += 1;
    });

    element.style.display = count > 0 ? 'block' : 'none';
  });
}

export function isNonEmptyObject(target: any): boolean {
  const keys = Object.keys(target);

  if (keys.length === 0) {
    return false;
  }

  return keys.every(key => {
    const value = target[key];

    return Object.keys(value).length > 0;
  });
}

export function countTrueProperties<T extends object>(
  target: T,
  keys: (keyof T)[],
): number {
  return keys.reduce((count, key) => count + (target[key] === true ? 1 : 0), 0);
}

export function serialize<T extends object>(target: T): T {
  return cloneDeepWith(target, val =>
    typeof val === 'function' ||
    typeof val === 'symbol' ||
    val === undefined ||
    Buffer?.isBuffer?.(val)
      ? undefined
      : undefined,
  );
}

export function sanitizeObject(target: any): any {
  return transform(target, (result, value, key) => {
    if (
      value === undefined ||
      typeof value === 'function' ||
      typeof value === 'symbol' ||
      Buffer?.isBuffer?.(value)
    ) {
      return;
    }

    result[key] =
      isPlainObject(value) || Array.isArray(value)
        ? sanitizeObject(value)
        : value;
  });
}
