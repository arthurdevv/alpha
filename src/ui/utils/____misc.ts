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

export function countTrueProperties<T extends object>(target: T, keys: (keyof T)[]): number {
  return keys.reduce((count, key) => count + (target[key] === true ? 1 : 0), 0);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value?.constructor === Object;
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
