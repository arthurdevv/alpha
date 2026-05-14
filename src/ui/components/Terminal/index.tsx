import { cx } from '@linaria/core';
import { useCallback, useEffect, useMemo, useRef } from 'preact/compat';
import { useShallow } from 'zustand/shallow';

import { useTermsStore } from 'ui/store/terms/store';
import type { Term } from 'ui/types';

import { Group } from './styles';
// import Tooltip from './Tooltip';

interface TermGroupProps {
  group: Term;
}

export default function Terms() {
  const { terms, origin } = useTermsStore(useShallow(s => ({ terms: s.terms, origin: s.origin })));

  if (!origin || !terms[origin]) return null;

  const group = useMemo(() => terms[origin], [terms, origin]);

  return <></>;

  // return (
  //   <Group className={cx(group.id === origin && 'c')} role="group">
  //     <h1>{group.id}</h1>
  //     {/* <TermGroup {...props} /> */}
  //   </Group>
  // );

  // {/* <Viewport {...store} /> */}
}

// function TermGroup({ group }: TermGroupProps) {
//   const createTerm = (id: string) => {
//     const instance = instances[id];

//     const termProps: TermProps = {
//       ...props,
//       ...instance,
//       isCurrent: current.includes(id),
//       onFocus: props.onFocus.bind(null, id),
//       onResize: props.onResize.bind(null, id),
//       onTitleChange: props.onTitleChange.bind(null, id),
//     };

//     return <Term {...termProps} key={id} />;
//   };

//   const createSplit = (children: JSX.Element[]) => {
//     const splitProps: SplitTermProps = {
//       ...group,
//       children,
//       onResizeGroup: props.onResizeGroup.bind(null, group.id),
//     };

//     return <SplitTerm {...splitProps} />;
//   };

//   const children = group.children.map(group => (
//     <TermGroup {...props} group={group} key={group.id} />
//   ));

//   return group.pid ? createTerm(group.pid) : createSplit(children);
// }
