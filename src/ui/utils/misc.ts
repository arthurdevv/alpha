import { cloneDeepWith } from 'lodash';

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
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
