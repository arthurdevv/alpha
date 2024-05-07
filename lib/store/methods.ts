export default (set: AlphaSet, getStore: () => AlphaStore) => ({
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

    return getStore();
  },

  setIn<I extends string, K extends keyof ITerminal>(
    props: [I, K?],
    value: any,
  ): AlphaStore {
    const [id, key] = props;

    set(state => {
      const { context } = state;

      if (key) {
        context[id][key] = value;
      } else {
        context[id] = value;
      }

      return { context };
    });

    return getStore();
  },

  getStore,
});
