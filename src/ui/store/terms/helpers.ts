// import { execCommand } from 'main/keymaps/commands';
import type { TermsStore } from 'ui/store/terms/types';
import type { Term } from 'ui/types';

export function getGroupNode({ terms }: TermsStore, id: UUID) {
  function search(terms: object, relativeGroup: any): Record<string, Term> | null {
    for (const key in terms) {
      const group: Term = terms[key];

      if (group.id === id || group.pid === id) {
        return { currentGroup: group, relativeGroup };
      }

      if (group.children.length > 0) {
        const result = search(group.children, group);

        if (result) return result;
      }
    }

    return null;
  }

  return search(terms, null) ?? {};
}

export function getGroupInfo({ terms }: TermsStore, id: string, length?: boolean) {
  function search(children: Term[], origin: string[]) {
    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];

      if (child.id === id || child.pid === id) {
        return {
          index: length ? index + 1 : index,
          path: [...origin, child.id],
        };
      }

      if (child.children.length > 0) {
        const result = search(child.children, [...origin, child.id]);

        if (result) return result;
      }
    }

    return null;
  }

  return search(Object.values(terms), []);
}

export function getOriginChildren(
  { terms, origin }: TermsStore,
  nested: boolean,
  target?: string,
): string[] {
  if (!nested) return Object.keys(terms);

  const children: string[] = [];
  const root = target || origin;

  if (!root) return children;

  function search({ pid, children: nested }: Term) {
    if (pid !== null) children.push(pid);
    nested.forEach(search);
  }

  search(terms[root]);

  return children;
}

export function emitDispose(id: string): void {
  const events = [
    ['process', 'kill'],
    ['terminal', 'dispose'],
  ];

  events.forEach(([channel, action]) => {
    // execCommand(`${channel}:action`, action, id);
  });
}
