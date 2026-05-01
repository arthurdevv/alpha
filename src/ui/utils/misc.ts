export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map(k => [k, obj[k]])) as Pick<T, K>;
}

export function sortArray(array: any[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function scrollToTop(selector: keyof HTMLElementTagNameMap) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function manipulateClassList(element: Element, token: string, action: 'add' | 'toggle') {
  if (action === 'toggle') {
    return element.classList.toggle(token);
  }

  element.classList.add(token);
  const { parentElement } = element;

  if (parentElement) {
    parentElement.childNodes.forEach(child => {
      if (child !== element) (child as Element).classList.remove('s');
    });
  }
}
