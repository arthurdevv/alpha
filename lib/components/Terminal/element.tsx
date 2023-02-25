import { h } from 'preact';
import { memo } from 'preact/compat';
import { useRef, useEffect, useCallback } from 'preact/hooks';

import Instance, { getOptions } from 'app/common/terminal';
import { terms } from 'lib/store/middlewares';
import { Container, Content } from './styles';

const Terminal: React.FC<TermProps> = (props: TermProps) => {
  const parent = useRef<HTMLDivElement>(null);

  const options = getOptions(props);

  const term = new Instance(options);

  const onContextMenu = useCallback(() => {
    const hasSelection = term.hasSelection();

    if (hasSelection) {
      const selection = term.getSelection();

      term.clipboard.writeText(selection);
    } else {
      document.execCommand('paste');
    }
  }, []);

  useEffect(() => {
    term.open(parent.current, props);

    terms[props.id] = term.instance;

    return () => {
      terms[props.id] = null;
    };
  }, []);

  useEffect(() => {
    const term = terms[props.id];

    if (term) {
      if (!props.isDirty) {
        term.clear();
      }

      term.options = options;
    }
  }, [props]);

  return (
    <Container
      role="presentation"
      className={props.isCurrent ? 'current' : undefined}
      onContextMenu={onContextMenu}
    >
      <Content ref={parent} />
    </Container>
  );
};

export default memo(Terminal);
