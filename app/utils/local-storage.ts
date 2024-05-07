function createItem(key: string): any {
  const item = localStorage.getItem(key);

  if (!item) {
    localStorage.setItem(key, '{}');
  }

  return {};
}

function parseItem(key: string): any {
  const item = localStorage.getItem(key);

  return item ? JSON.parse(item) : createItem(key);
}

function updateItem(key: string, value: any, spread?: boolean): void {
  const item = parseItem(key);

  value = JSON.stringify(spread ? { ...item, ...value } : value);

  localStorage.setItem(key, value);
}

function deleteValue(key: string, value: any, update: boolean): any {
  const item = parseItem(key);

  delete item[value];

  if (update) {
    updateItem(key, item);
  } else {
    return item;
  }
}

function deleteItem(key: string) {
  localStorage.removeItem(key);
}

export default { createItem, parseItem, updateItem, deleteValue, deleteItem };
