import { h } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { Container } from './styles';

const Viewport: React.FC<ViewportProps> = (props: ViewportProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (props.cols || props.rows) {
      setVisible(true);

      interval = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [props]);

  return (
    <Container className={visible ? 'visible' : undefined}>
      {props.cols}x{props.rows}
    </Container>
  );
};

export default memo(Viewport);
