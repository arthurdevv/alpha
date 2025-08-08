import { isEqual } from 'lodash';

function getUnique<T>(target: T[]): T[] {
  const result: typeof target = [];

  target.forEach(value => {
    if (!result.some(item => isEqual(item, value))) result.push(value);
  });

  return result;
}

export default (
  { chunk, buffer }: { chunk: any; buffer: string },
  scripts: IScript[],
  callback: (execute: string) => void,
) => {
  buffer += chunk;

  getUnique(scripts).forEach(({ type, match, execute }) => {
    const matched = (
      type === 'exact' ? new RegExp(`\\b${match}\\b`, 'i') : match
    ).test(buffer);

    if (matched) {
      buffer = '';
      callback(execute);
    }
  });
};

export { getUnique };
