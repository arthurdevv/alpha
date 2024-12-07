import { h } from 'preact';
import { memo, useCallback, useEffect, useRef } from 'preact/compat';

import Terminal, { terms } from 'app/common/terminal';
import { execCommand } from 'app/keymaps/commands';
import { getSettings } from 'app/settings';

import { Content, Indicator, Pane } from './styles';
import { ScreenFullIcon } from '../Icons';

const Term: React.FC<TermProps> = (props: TermProps) => {
  const parent = useRef<HTMLElement | null>(null);

  const onContextMenu = useCallback((event: MouseEvent) => {
    const term = terms[props.id];

    if (term) {
      const { rightClick } = getSettings();

      if (rightClick === 'clipboard') {
        term.handleClipboard();
      } else if (rightClick === 'contextmenu') {
        global.menu = { top: event.clientY, left: event.clientX };

        execCommand('app:modal', 'ContextMenu');
      }

      global.id = props.id;
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    const { focusOnHover } = getSettings();

    if (focusOnHover) props.onFocus();
  }, []);

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 2) props.onFocus();
  }, []);

  const onRef = useCallback((element: HTMLElement | null) => {
    parent.current = element;

    let observer: ResizeObserver;

    if (element) {
      let timeout: NodeJS.Timeout;

      observer = new ResizeObserver(() => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          const term = terms[props.id];

          if (term) term.fit();
        }, 200);
      });

      observer.observe(element);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const { current } = parent;

    if (current) {
      const cached = terms[props.id];

      if (!cached) {
        const term = new Terminal(props);

        term.open(current);
      } else {
        const { element } = cached.term;

        current.appendChild(element!);
      }
    }

    return () => {
      global.id = null;
    };
  }, []);

  useEffect(() => {
    const term = terms[props.id];

    if (term) {
      term.setOptions(props.options);

      if (props.isCurrent) term.focus();
    }
  }, [props]);

  return (
    <Pane
      role="presentation"
      $isCurrent={props.isCurrent}
      $isExpanded={props.isExpanded}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onContextMenu}
    >
      <Content ref={onRef} />
      <Indicator>
        <ScreenFullIcon />
      </Indicator>
    </Pane>
  );
};

export default memo(Term);
