export function unit(n: number, label: string): string {
  return n > 0 ? `${n} ${label}${n > 1 ? 's' : ''}` : '';
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map(k => [k, obj[k]])) as Pick<T, K>;
}

export function sortArray<T extends { name: string }>(array: T[]): T[] {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function scrollToTop(selector: keyof HTMLElementTagNameMap): void {
  const element = document.querySelector(selector);
  if (element) element.scrollTo({ top: 0, behavior: 'smooth' });
}

export function manipulateClassList(el: Element, token: string, action: 'add' | 'toggle'): boolean {
  if (action === 'toggle') return el.classList.toggle(token);

  el.classList.add(token);
  const { parentElement } = el;

  if (parentElement) {
    parentElement.childNodes.forEach(child => {
      if (child !== el) (child as Element).classList.remove('s');
    });
  }

  return true;
}
