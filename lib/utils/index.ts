function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

function onSearch({ currentTarget }) {
  const {
    value,
    parentElement: { parentElement },
  } = currentTarget;

  const lists: HTMLElement[] = parentElement.querySelectorAll('ul');

  lists.forEach(element => {
    const items = element.querySelectorAll('li[data-name]');

    let count = 0;

    items.forEach(item => {
      const name = item.getAttribute('data-name')?.toLowerCase();

      const isVisible = name && name.includes(value.toLowerCase());

      (item as HTMLElement).style.display = isVisible ? 'flex' : 'none';

      if (isVisible) count += 1;
    });

    element.style.display = count > 0 ? 'block' : 'none';
  });
}

function isNonEmptyObject(target: any): boolean {
  const keys = Object.keys(target);

  if (keys.length === 0) {
    return false;
  }

  return keys.every(key => {
    const value = target[key];

    return Object.keys(value).length > 0;
  });
}

function somePropertyIsTrue<T extends object>(
  target: T,
  key: keyof T[keyof T],
): boolean {
  return Object.values(target).some(value => value[key] === true);
}

export { sortArray, onSearch, isNonEmptyObject, somePropertyIsTrue };
