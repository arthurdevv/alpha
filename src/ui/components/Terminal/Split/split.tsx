import { throttle } from 'lodash';
import { Fragment, memo, useState } from 'preact/compat';

import { Divider, Panes, SplitPane } from '../styles';

interface SplitTermProps {
  orientation: 'vertical' | 'horizontal';
  ratios: number[];
  children: React.JSX.Element[];
  onResizeGroup: (ratios: number[]) => void;
}

function SplitTerm({ orientation, children, ratios, onResizeGroup }: SplitTermProps) {
  const [dimension, offset, client, cursor] = {
    vertical: ['width', 'left', 'clientX', 'ew-resize'],
    horizontal: ['height', 'top', 'clientY', 'ns-resize'],
  }[orientation!];

  const [isDragging, setDragging] = useState<boolean>(false);

  const onMouseDown = ({ currentTarget }, index: number) => {
    const { parentElement } = currentTarget;

    const position = currentTarget.getBoundingClientRect()[offset];
    const totalSize = parentElement.getBoundingClientRect()[dimension];

    const onMouseMove = throttle((event: MouseEvent) => {
      const ratios = [...props.ratios];

      const delta = position - event[client];
      const ratio = -delta / totalSize;

      ratios[index] += ratio;
      ratios[index + 1] -= ratio;

      onResizeGroup(ratios);
    }, 16);

    const onMouseUp = () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);

      setDragging(() => currentTarget.classList.toggle('dragging'));
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    setDragging(() => currentTarget.classList.toggle('dragging'));
  };

  const onDoubleClick = (index: number) => {
    const ratios = [...props.ratios];

    const ratio = (ratios[index] + ratios[index + 1]) / 2;

    for (let i = index; i <= index + 1; i += 1) {
      ratios[i] = ratio;
    }

    onResizeGroup(ratios);
  };

  return (
    <Panes
      className={orientation === 'vertical' ? 'ew' : 'ns'}
      style={{ cursor: isDragging ? cursor : 'default' }}
    >
      {children.map((child, index) => (
        <Fragment key={index}>
          <SplitPane style={{ [dimension]: `${ratios[index] * 100}%` }}>{child}</SplitPane>
          {index < children.length - 1 && (
            <Divider
              onMouseDown={event => onMouseDown(event, index)}
              onDblClick={() => onDoubleClick(index)}
            />
          )}
        </Fragment>
      ))}
    </Panes>
  );
}

export default memo(SplitTerm);
