function getGroupNode({ context }: AlphaState, id: string) {
  let node: Record<string, IGroup> = {};

  function search(context: object, relativeGroup: any) {
    Object.keys(context).forEach(key => {
      const group: IGroup = context[key];

      if (group.id === id || group.pid === id) {
        node = { currentGroup: group, relativeGroup };
      }

      if (group.children.length > 0) {
        const result = search(group.children, group);

        if (result) {
          node = result;
        }
      }
    });

    return null;
  }

  search(context, null);

  return node;
}

function getGroupInfo({ context }: AlphaStore, id: string, length?: boolean) {
  function search(children: IGroup[], origin: string[]) {
    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];

      const path = [...origin, child.id];

      if (child.id === id || child.pid === id) {
        return { index: length ? index + 1 : index, path };
      }

      if (child.children.length > 0) {
        const result = search(child.children, path);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  return search(Object.values(context), []);
}

function getCurrentChildren(
  { context, current }: AlphaStore,
  nested: boolean,
  target?: string,
) {
  const children: string[] = [];

  function search(group: IGroup) {
    if (group.pid !== null) {
      children.push(group.pid);
    }

    if (group.children.length > 0) {
      group.children.forEach(child => search(child));
    }
  }

  if (nested) {
    const { origin } = current;

    if (origin) {
      const group = context[target || origin];

      search(group);
    }

    return children;
  }

  return Object.keys(context);
}

export { getGroupNode, getGroupInfo, getCurrentChildren };
