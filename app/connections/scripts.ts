function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

function getUnique<T>(target: T[]): T[] {
  const result: typeof target = [];

  target.forEach(value => {
    if (!result.some(item => deepEqual(item, value))) result.push(value);
  });

  return result;
}

const regexCache = new Map<string, RegExp>();

function getCachedRegex(match: string): RegExp {
  if (!regexCache.has(match)) {
    regexCache.set(match, new RegExp(`\\b${match}\\b`, 'i'));
  }
  return regexCache.get(match)!;
}

export default (
  { chunk, buffer }: { chunk: any; buffer: string },
  scripts: IScript[],
  callback: (execute: string) => void,
) => {
  buffer += chunk;

  getUnique(scripts).forEach(({ type, match, execute }) => {
    const matched = (
      type === 'exact' ? getCachedRegex(match as string) : match
    ).test(buffer);

    if (matched) {
      buffer = '';
      callback(execute);
    }
  });
};

export { getUnique };
