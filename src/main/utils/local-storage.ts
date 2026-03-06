import { reportError } from 'shared/error-reporter';

function createItem(key: string, value?: any): any {
  const item = localStorage.getItem(key);

  if (!item) {
    localStorage.setItem(key, value ?? '{}');
  }

  return value && typeof value !== 'object' ? value : {};
}

function parseItem(key: string, value?: any): any {
  const item = localStorage.getItem(key);

  if (item) {
    try {
      if (/[{}[\]]/.test(item) || ['true', 'false'].includes(item)) {
        return JSON.parse(item);
      }

      return item;
    } catch (error) {
      reportError(error);
    }
  }

  return createItem(key, value);
}

function updateItem(key: string, value: any, spread?: boolean): void {
  const item = parseItem(key);

  if (typeof value !== 'string') {
    value = JSON.stringify(spread ? { ...item, ...value } : value);
  }

  localStorage.setItem(key, value);
}

function toggleItem(key: string): any {
  const item = parseItem(key);

  const value = JSON.stringify(!item);

  localStorage.setItem(key, value);

  return !item;
}

function deleteItem(key: string): { updateItem: typeof updateItem } {
  localStorage.removeItem(key);

  return { updateItem };
}

export default { createItem, parseItem, updateItem, toggleItem, deleteItem };
