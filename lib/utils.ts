import { cloneDeepWith, isPlainObject, transform } from 'lodash';

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

export function getDateFormatted(
  language: string = 'en-US',
  value?: number | string | Date,
): string {
  let date = new Date();

  let options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (value) {
    date = new Date(value);

    options = {
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
  }

  return new Intl.DateTimeFormat(language, options).format(date);
}
