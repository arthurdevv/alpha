import { isPlainObject, transform } from 'lodash';

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
