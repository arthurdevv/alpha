export function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

export function onSearch({ currentTarget }) {
  const { value, parentElement } = currentTarget;

  const elements = Array.from<HTMLElement>(
    parentElement?.parentElement.getElementsByTagName('li'),
  );

  elements.forEach(item => {
    const name = item.getAttribute('data-name')?.toLowerCase();

    if (name) {
      const index = name.indexOf(value.toLowerCase());

      item.style.display = index > -1 ? '' : 'none';
    }
  });
}
