import { h } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { Container } from './styles';

const Viewport: React.FC<ViewportProps> = (props: ViewportProps) => {
  const [isVisible, setVisible] = useState(false);

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
    <Container $isVisible={isVisible}>
      {props.cols}x{props.rows}
    </Container>
  );
};

export default memo(Viewport);
