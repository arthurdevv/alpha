export default (set: AlphaSet, getState: () => AlphaStore) => ({
  set<K extends keyof AlphaState>(
    property: K,
    value: AlphaState[K],
  ): AlphaStore {
    set(state => {
      if (property in state) {
        return {
          [property]: value,
        };
      }

      return state;
    });

    return getState();
  },

  setIn<I extends string, K extends keyof ITerminal>(
    props: [I, K?],
    value: any,
  ): AlphaStore {
    const id = props[0];

    const key = props[1];

    set(state => {
      const { context } = state;

      if (key) {
        context[id][key] = value;
      } else {
        context[id] = value;
      }

      return { context };
    });

    return getState();
  },

  getState,
});
