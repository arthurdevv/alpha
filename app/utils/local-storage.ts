function createItem(key: string, value?: any): any {
  const item = localStorage.getItem(key);

  if (!item) {
    localStorage.setItem(key, value ?? '{}');
  }

  return typeof value !== 'object' ? value : {};
}

function parseItem(key: string, value?: any): any {
  let item = localStorage.getItem(key);

  if (item) {
    try {
      item = JSON.parse(item);
    } catch (error) {
      return item;
    }
  }

  return item ?? createItem(key, value);
}

function updateItem(key: string, value: any, spread?: boolean): void {
  const item = parseItem(key);

  value = JSON.stringify(spread ? { ...item, ...value } : value);

  localStorage.setItem(key, value);
}

function deleteItem(key: string): { updateItem: typeof updateItem } {
  localStorage.removeItem(key);

  return { updateItem };
}

export default { createItem, parseItem, updateItem, deleteItem };
