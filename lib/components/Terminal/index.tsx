import { h } from 'preact';
import { memo } from 'preact/compat';
import { useRef, useEffect, useCallback } from 'preact/hooks';

import { clipboard } from '@electron/remote';
import Terminal, { terms } from 'app/common/terminal';
import useStore from 'lib/store';

import { Group, Container, Content } from './styles';
import Viewport from './Viewport';
import Settings from '../Settings';

const Term: React.FC<TermProps> = (props: TermProps) => {
  const terminal = new Terminal(props);

  const parent = useRef<HTMLDivElement>();

  const onContextMenu = useCallback(() => {
    const term = terms[props.id];

    if (term) {
      const hasSelection = term.hasSelection();

      if (hasSelection) {
        const selection = term.getSelection();

        clipboard.writeText(selection);
      } else {
        document.execCommand('paste');
      }
    }
  }, []);

  useEffect(() => {
    const { current } = parent;

    if (current) {
      terminal.open(current);
    }

    terms[props.id] = terminal.term;

    return () => {
      terms[props.id] = null;
    };
  }, []);

  useEffect(() => {
    const term = terms[props.id];

    if (term) {
      const { options, isDirty, isCurrent } = props;

      if (!isDirty) term.clear();

      if (isCurrent) term.focus();

      term.options = options;
    }
  }, [props]);

  return (
    <Container
      role="presentation"
      $isCurrent={props.isCurrent}
      onContextMenu={onContextMenu}
    >
      <Content ref={parent} />
    </Container>
  );
};

const TermGroup: React.FC = () => {
  const {
    context,
    options,
    cols,
    rows,
    current,
    onSelect,
    onResize,
    onTitleChange,
  } = useStore();

  return (
    <Group role="group">
      {Object.keys(context).map((id, index) => {
        const { shell, isDirty } = context[id];

        const props: TermProps = {
          id,
          isDirty,
          isCurrent: id === current,
          onSelect: onSelect.bind(null, id),
          onTitleChange: onTitleChange.bind(null, id),
          onResize,
          options,
        };

        return shell ? (
          <Term {...props} key={index} />
        ) : (
          <Settings {...props} key={index} />
        );
      })}
      <Viewport cols={cols} rows={rows} />
    </Group>
  );
};

export default memo(TermGroup);
