import { h } from 'preact';
import { memo } from 'preact/compat';

import { Group } from './styles';
import Terminal from './element';
import Viewport from './Viewport';

const TerminalGroup: React.FC<TerminalProps> = (props: TerminalProps) => {
  const { terms, cols, rows } = props;

  return (
    <Group role="group">
      {terms.map((term: ITerminal) => {
        const { pid } = term;

        if (!pid) return;

        const mappedProps: TermProps = {
          fontSize: props.fontSize,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
          fontLigatures: props.fontLigatures,
          lineHeight: props.lineHeight,
          letterSpacing: props.letterSpacing,
          cursorStyle: props.cursorStyle,
          cursorBlink: props.cursorBlink,
          theme: props.theme,
          id: pid,
          isDirty: props.process[pid].isDirty,
          isCurrent: pid === props.current,
          onCurrent: props.onCurrent.bind(null, pid),
          onData: props.onData.bind(null, pid),
          onTitle: props.onTitle.bind(null, pid),
          onResize: props.onResize.bind(null, pid),
        };

        return <Terminal {...mappedProps} key={pid} />;
      })}
      <Viewport cols={cols} rows={rows} />
    </Group>
  );
};

export default memo(TerminalGroup);
