import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { somePropertyIsTrue } from 'lib/utils';

import { Container } from './styles';

const Viewport: React.FC<ViewportProps> = (props: ViewportProps) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const [shifted, setShifted] = useState<boolean>(false);

  const {
    viewport: { cols, rows },
    processes,
  } = props;

  useEffect(() => {
    setShifted(somePropertyIsTrue(processes, 'isExpanded'));

    let timeout: NodeJS.Timeout;

    if (cols || rows) {
      setVisible(true);

      timeout = setTimeout(() => {
        setVisible(false);
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [cols, rows]);

  return (
    <Container $isVisible={isVisible} $shifted={shifted}>
      {cols}x{rows}
    </Container>
  );
};

export default memo(Viewport);
