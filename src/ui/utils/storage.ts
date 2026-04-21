import { reportError } from 'shared/error-reporter';

class Storage {
  constructor(private readonly store: globalThis.Storage) {}

  create(key: string, value?: any): any {
    if (!this.store.getItem(key)) {
      this.store.setItem(key, JSON.stringify(value) ?? '{}');
    }

    return value && typeof value !== 'object' ? value : {};
  }

  parse(key: string, fallback?: any): any {
    const item = this.store.getItem(key);
    if (!item) return this.create(key, fallback);

    try {
      if (/[{}[\]]/.test(item) || ['true', 'false'].includes(item)) {
        return JSON.parse(item);
      }

      return item;
    } catch (error) {
      reportError(error);
      return item;
    }
  }

  update(key: string, value: any, spread?: boolean): void {
    const current = this.parse(key);
    const next = spread && typeof current === 'object' ? { ...current, ...value } : value;
    this.store.setItem(key, typeof next === 'string' ? next : JSON.stringify(next));
  }

  toggle(key: string): boolean {
    const next = !this.parse(key);
    this.store.setItem(key, JSON.stringify(next));
    return next;
  }

  delete(key: string): void {
    this.store.removeItem(key);
  }
}

export const local = new Storage(localStorage);
export const session = new Storage(sessionStorage);
