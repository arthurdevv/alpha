import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';
import { throttle } from 'lodash';

import { Divider, Panes, SplitPane } from './styles';

const SplitTerm: React.FC<SplitTermProps> = (props: SplitTermProps) => {
  const { orientation, children, ratios } = props;

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

      props.onResizeGroup(ratios);
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

    props.onResizeGroup(ratios);
  };

  return (
    <Panes $cursor={cursor} $isDragging={isDragging}>
      {children.map((child, index) => (
        <Fragment key={index}>
          <SplitPane style={{ [dimension]: `${ratios[index] * 100}%` }}>
            {child}
          </SplitPane>
          {index < children.length - 1 && (
            <Divider
              onMouseDown={(event: MouseEvent) => onMouseDown(event, index)}
              onDblClick={() => onDoubleClick(index)}
            />
          )}
        </Fragment>
      ))}
    </Panes>
  );
};

export default memo(SplitTerm);
