import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';

import styles from './styles.module.css';

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

    let rafId: number | null = null;

    const onMouseMove = (event: MouseEvent) => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const ratios = [...props.ratios];

        const delta = position - event[client];
        const ratio = -delta / totalSize;

        ratios[index] += ratio;
        ratios[index + 1] -= ratio;

        props.onResizeGroup(ratios);
        rafId = null;
      });
    };

    const onMouseUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);

      currentTarget.classList.remove('dragging');
      setDragging(false);
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    currentTarget.classList.add('dragging');
    setDragging(true);
  };

  const onDoubleClick = (index: number) => {
    const ratios = [...props.ratios];

    const ratio = (ratios[index] + ratios[index + 1]) / 2;

    for (let i = index; i <= index + 1; i += 1) {
      ratios[i] = ratio;
    }

    props.onResizeGroup(ratios);
  };

  const isHorizontal = cursor === 'ew-resize';
  const panesClasses = [
    styles.panes,
    isHorizontal ? styles.panesHorizontal : styles.panesVertical,
    isDragging ? (isHorizontal ? styles.panesDraggingHorizontal : styles.panesDraggingVertical) : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={panesClasses}>
      {children.map((child, index) => (
        <Fragment key={index}>
          <div className={styles.splitPane} style={{ [dimension]: `${ratios[index] * 100}%` }}>
            {child}
          </div>
          {index < children.length - 1 && (
            <span
              className={styles.divider}
              onMouseDown={(event: MouseEvent) => onMouseDown(event, index)}
              onDblClick={() => onDoubleClick(index)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default memo(SplitTerm);
