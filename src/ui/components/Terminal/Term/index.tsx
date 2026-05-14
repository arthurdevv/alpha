import { useCallback, useEffect, useRef } from 'preact/compat';

import type { Viewport } from 'shared/types';

import { Container, Content } from './styles';

interface TermProps {
  id: UUID;
  isCurrent: boolean;

  onData(data: string): void;
  onFocus(broadcast: boolean): void;
  onResize(viewport: Viewport): void;
  onTitleChange(title: string): void;
}

export default function Term({
  id,
  isCurrent,
  onData,
  onFocus,
  onResize,
  onTitleChange,
}: TermProps) {
  const parent = useRef<HTMLElement | null>(null);

  // const onContextMenu = (event: MouseEvent) => {
  //   const term = terms[id];

  //   event.preventDefault();

  //   if (term) {
  //     const { rightClick } = getSettings();

  //     if (rightClick === 'clipboard') {
  //       term.handleClipboard();
  //     } else if (rightClick === 'contextmenu') {
  //       props.onFocus(false);

  //       global.menu = { top: event.clientY, left: event.clientX };
  //       global.handleModal(undefined, 'TerminalContextMenu', { on: 1, off: 1 });
  //     }

  //     global.id = props.id;
  //   }
  // };

  // const onMouseEnter = () => {
  //   const { focusOnHover } = getSettings();

  //   if (focusOnHover) props.onFocus();
  // };

  // const onMouseDown = (event: MouseEvent) => {
  //   if (event.button !== 2) props.onFocus();
  // };

  // const onRef = useCallback(
  //   (element: HTMLElement | null) => {
  //     parent.current = element;

  //     let observer: ResizeObserver;

  //     if (element) {
  //       let timeout: NodeJS.Timeout;

  //       observer = new ResizeObserver(() => {
  //         clearTimeout(timeout);

  //         timeout = setTimeout(() => {
  //           const term = terms[id];

  //           if (term) term.fit();
  //         }, 200);
  //       });

  //       observer.observe(element);
  //     }

  //     return () => {
  //       if (observer) observer.disconnect();
  //     };
  //   },
  //   [id],
  // );

  // useEffect(() => {
  //   const { current } = parent;

  //   if (current) {
  //     const cached = terms[id];

  //     if (!cached) {
  //       const term = new Terminal(props);

  //       term.open(current);
  //     } else {
  //       const { element } = cached.term;

  //       current.appendChild(element!);
  //     }
  //   }

  //   return () => {
  //     global.id = null;
  //   };
  // }, []);

  // useEffect(() => {
  //   const term = terms[id];

  //   if (term) {
  //     term.setOptions(props.options);

  //     if (props.isCurrent) term.focus();
  //   }
  // }, [props]);

  // const backgroundColor = (() => {
  //   const { theme, preserveBackground, acrylic } = props.options;

  //   if (!preserveBackground) {
  //     const { background } = loadTheme(theme);

  //     return acrylic ? changeOpacity(background, 0.7) : background;
  //   }
  // })();

  return (
    <Container
    // onMouseDown={onMouseDown}
    // onMouseEnter={onMouseEnter}
    // onContextMenu={onContextMenu}
    // style={{ backgroundColor }}
    >
      <Content
      // ref={onRef}
      />
      {/* <Tooltip {...props} /> */}
    </Container>
  );
}
