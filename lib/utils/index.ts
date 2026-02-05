function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value?.constructor === Object;
}

export function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

export function onSearch(
  { currentTarget },
  display: string = 'block',
  callback?: Function,
) {
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

    element.style.display = count > 0 ? display : 'none';
    element.classList[count > 0 ? 'remove' : 'add']('empty');
    element.classList[count > 0 ? 'add' : 'remove']('visible');
  });

  const wrapper = parentElement.querySelector('.w');
  const emptyLists = parentElement.querySelectorAll('ul.empty');

  wrapper.classList[lists.length === emptyLists.length ? 'add' : 'remove'](
    'blank',
  );

  callback && callback(value);
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
  function deepClone(value: unknown): unknown {
    if (
      value === null ||
      typeof value === 'function' ||
      typeof value === 'symbol' ||
      value === undefined ||
      Buffer?.isBuffer?.(value)
    ) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.map(item => deepClone(item));
    }

    if (isPlainObject(value)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        result[key] = deepClone(value[key]);
      }
      return result;
    }

    return value;
  }

  return deepClone(target) as T;
}

export function sanitizeObject(target: any): any {
  const isArray = Array.isArray(target);
  const result: any = isArray ? [] : {};

  const entries = isArray
    ? target.map((value: any, index: number) => [index, value])
    : Object.entries(target);

  for (const [key, value] of entries) {
    if (
      value === undefined ||
      typeof value === 'function' ||
      typeof value === 'symbol' ||
      Buffer?.isBuffer?.(value)
    ) {
      continue;
    }

    result[key] =
      isPlainObject(value) || Array.isArray(value)
        ? sanitizeObject(value)
        : value;
  }

  return result;
}

export function getDateFormatted(language: string): string {
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}
