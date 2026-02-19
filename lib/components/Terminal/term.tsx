import { memo, useCallback, useEffect, useRef, useState } from 'preact/compat';

import Terminal, { terms, zooms } from 'app/common/terminal';
import { loadTheme } from 'app/common/themes';
import { getSettings } from 'app/settings';
import { changeOpacity } from 'app/utils/color-utils';

import { Content, Pane } from './styles';

const Term: React.FC<TermProps> = (props: TermProps) => {
  const parent = useRef<HTMLElement | null>(null);

  const [zoom, setZoom] = useState<number | null>(zooms[props.id]);

  const handleZoom = (direction: number) => {
    setZoom(zoom => {
      const updated = Math.min(80, Math.max(-15, (zoom ?? 0) + direction * 1));

      zooms[props.id] = updated;

      return updated;
    });
  };

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

  const onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey) return;
    event.preventDefault();

    handleZoom(event.deltaY > 0 ? -1 : 1);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.ctrlKey) return;
    event.preventDefault();

    if (event.key === '+' || event.key === '=') {
      handleZoom(1);
    } else if (event.key === '-') {
      handleZoom(-1);
    } else if (event.key === '0') {
      setZoom(0);

      zooms[props.id] = 0;
    }
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
      const { fontSize } = props.options;

      term.setOptions({
        ...props.options,
        fontSize: fontSize ? fontSize + (zoom ?? 0) : undefined,
      });

      if (props.isCurrent) term.focus();
    }
  }, [props.options, props.isCurrent, zoom]);

  const backgroundColor = (() => {
    const { theme, preserveBackground, acrylic } = props.options;

    if (!preserveBackground) {
      const { background } = loadTheme(theme);

      return acrylic ? changeOpacity(background, 0.7) : background;
    }
  })();

  return (
    <Pane
      role="presentation"
      className={props.isExpanded ? 'expanded' : undefined}
      $isCurrent={props.isCurrent}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onContextMenu}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      style={{ backgroundColor }}
    >
      <Content ref={onRef} />
    </Pane>
  );
};

export default memo(Term);
