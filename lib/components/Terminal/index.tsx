import { Fragment, h } from 'preact';
import { memo, useEffect, useRef } from 'preact/compat';

import { clipboard } from '@electron/remote';
import Terminal, { terms } from 'app/common/terminal';
import useStore from 'lib/store';

import { Container, Content, Group } from './styles';
import Viewport from './Viewport';
import Settings from './Settings';
import Watermark from './Watermark';

const Term: React.FC<TermProps> = (props: TermProps) => {
  const terminal = new Terminal(props);

  const parent = useRef<HTMLDivElement>();

  const onContextMenu = () => {
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
  };

  useEffect(() => {
    const { current } = parent;

    if (current) {
      terminal.open(current);
    }

    terms[props.id] = terminal.term;

    return () => {
      delete terms[props.id];
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
    <Fragment>
      <Group role="group">
        {Object.keys(context).map((id, index) => {
          const { name, shell, isDirty } = context[id];

          const props: TermProps = {
            id,
            isDirty,
            isCurrent: id === current,
            onSelect: onSelect.bind(null, id),
            onTitleChange: onTitleChange.bind(null, id, name),
            onResize,
            options,
          };

          return shell ? (
            <Term {...props} key={index} />
          ) : (
            <Settings key={index} />
          );
        })}
        <Viewport cols={cols} rows={rows} />
      </Group>
      <Watermark />
    </Fragment>
  );
};

export default memo(TermGroup);
