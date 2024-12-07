function createItem(key: string, value?: any): any {
  const item = localStorage.getItem(key);

  if (!item) {
    localStorage.setItem(key, value ?? '{}');
  }

  return typeof value === 'boolean' ? value : {};
}

function parseItem(key: string, value?: any): any {
  const item = localStorage.getItem(key);

  return item ? JSON.parse(item) : createItem(key, value);
}

function updateItem(key: string, value: any, spread?: boolean): void {
  const item = parseItem(key);

  value = JSON.stringify(spread ? { ...item, ...value } : value);

  localStorage.setItem(key, value);
}

function deleteItem(key: string) {
  localStorage.removeItem(key);

  return { updateItem };
}

export default { createItem, parseItem, updateItem, deleteItem };
