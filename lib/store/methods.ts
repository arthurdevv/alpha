function getNestedObject(target: object, path: string | string[], value: any) {
  if (typeof path === 'string') {
    return { ...target, [path]: value };
  }

  const [first, ...rest] = path;

  if (rest.length === 0) {
    return { ...target, [first]: value };
  }

  return {
    ...target,
    [first]: getNestedObject(target[first] || {}, rest, value),
  };
}

export default {
  set(path: string | string[], value: any): AlphaStore {
    const prototype = Object.getPrototypeOf(this);

    const target = Object.create(prototype);

    Object.keys(this).forEach(key => {
      if (Object.getOwnPropertyDescriptor(this, key)) {
        target[key] = this[key];
      }
    });

    return getNestedObject(target, path, value);
  },

  assign(path: string[], value: any): AlphaStore {
    const [first] = path;

    const target = this[first];

    Object.entries<object>(target).forEach(([key, value]) => {
      if (typeof value === 'object') {
        path.splice(1, 0, key);
      } else {
        path.push(value);
      }
    });

    path.splice(path.length - 1, 1);

    return this.set(path, value);
  },

  merge<T extends object>(target: T, partial: NestedPartial<T>): T {
    const result = { ...target };

    const isObject = (value: any) =>
      typeof value === 'object' && !Array.isArray(value);

    Object.keys(partial).forEach(key => {
      if (isObject(partial[key]) && isObject(target[key])) {
        result[key] = this.merge(target[key], partial[key]);
      } else {
        result[key] = partial[key];
      }
    });

    return Object.freeze(result);
  },

  update(path: string[], value: any) {
    const [first, id] = path;

    const target = this[first];

    const update = (target: object) =>
      Object.entries(target).some(([key, child]) => {
        if (child.id === id) {
          target[key] = Object.assign(child, value);

          return true;
        }

        if (child.children) {
          return child.children.some((value: IGroup) =>
            update({ [value.id]: value }),
          );
        }

        return false;
      });

    update(target);

    return this.set([first], target);
  },

  without(path: string[]) {
    const [first] = path;

    const target = this[first];

    path.forEach(key => {
      delete target[key];
    });

    return this.set(first, target);
  },

  toggle(path: string[]): AlphaStore {
    const value = path.reduce((id, key) => id[key], this);

    return this.set(path, !value);
  },
};
