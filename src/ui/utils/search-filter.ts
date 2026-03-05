export function onSearch(
  { currentTarget },
  display: string = 'block',
  callback?: Function,
) {
  const {
    value,
    parentElement: { parentElement },
  } = currentTarget;

  const lists: HTMLElement[] = parentElement.querySelectorAll('ul');

  lists.forEach(element => {
    const items = element.querySelectorAll('li[data-name]');

    let count = 0;

    items.forEach(item => {
      const name = (item as any).dataset.name?.toLowerCase();

      const isVisible = name && name.includes(value.toLowerCase());

      (item as HTMLElement).style.display = isVisible ? 'flex' : 'none';

      if (isVisible) count += 1;
    });

    element.style.display = count > 0 ? display : 'none';
    element.classList[count > 0 ? 'remove' : 'add']('empty');
    element.classList[count > 0 ? 'add' : 'remove']('visible');
  });

  const wrapper = parentElement.querySelector('.w');
  const emptyLists = parentElement.querySelectorAll('ul.empty');

  wrapper.classList[lists.length === emptyLists.length ? 'add' : 'remove'](
    'blank',
  );

  callback && callback(value);
}
