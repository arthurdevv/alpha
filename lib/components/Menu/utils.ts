function onSearch(event: React.ChangeEvent<HTMLInputElement>): void {
  const { currentTarget } = event;

  const { value, parentElement } = currentTarget;

  const container = parentElement?.parentElement;

  if (container) {
    const elements = Array.from(container.getElementsByTagName('li'));

    elements.forEach(item => {
      const dataTitle = item.getAttribute('data-title')?.toLowerCase();

      if (dataTitle) {
        const index = dataTitle.indexOf(value.toLowerCase());

        item.style.display = index > -1 ? '' : 'none';
      }
    });
  }
}

const sortArray = (array: any[]): typeof array =>
  array.sort((a, b) => a.title.localeCompare(b.title));

export { onSearch, sortArray };
