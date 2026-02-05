import { memo, useCallback, useEffect, useRef } from 'preact/compat';

import Terminal, { terms } from 'app/common/terminal';
import { getSettings } from 'app/settings';
import { loadTheme } from 'app/common/themes';
import { changeOpacity } from 'app/utils/color-utils';

import styles from './styles.module.css';
import Tooltip from './Tooltip';

const Term: React.FC<TermProps> = (props: TermProps) => {
  const parent = useRef<HTMLElement | null>(null);

  const onContextMenu = (event: MouseEvent) => {
    const term = terms[props.id];

    event.preventDefault();

    if (term) {
      const { rightClick } = getSettings();

      if (rightClick === 'clipboard') {
        term.handleClipboard();
      } else if (rightClick === 'contextmenu') {
        props.onFocus(false);

        global.menu = { top: event.clientY, left: event.clientX };
        global.handleModal(undefined, 'TerminalContextMenu', { on: 1, off: 1 });
      }

      global.id = props.id;
    }
  };

  const onMouseEnter = () => {
    const { focusOnHover } = getSettings();

    if (focusOnHover) props.onFocus();
  };

  const onMouseDown = (event: MouseEvent) => {
    if (event.button !== 2) props.onFocus();
  };

  const onRef = useCallback(
    (element: HTMLElement | null) => {
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
    },
    [props.id],
  );

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

  const backgroundColor = (() => {
    const { theme, preserveBackground, acrylic } = props.options;

    if (!preserveBackground) {
      const { background } = loadTheme(theme);

      return acrylic ? changeOpacity(background, 0.7) : background;
    }
  })();

  const paneClasses = [
    styles.pane,
    props.isCurrent ? styles.paneCurrent : '',
    props.isExpanded ? 'expanded' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      role="presentation"
      className={paneClasses}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onContextMenu}
      style={{ backgroundColor }}
    >
      <div className={styles.content} ref={onRef} />
      <Tooltip {...props} />
    </div>
  );
};

export default memo(Term);
