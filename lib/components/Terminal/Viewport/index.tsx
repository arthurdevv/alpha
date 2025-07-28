import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { countTrueProperties } from 'lib/utils';

import { Container } from './styles';

const Viewport: React.FC<AlphaStore> = (props: AlphaStore) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const [shift, setShift] = useState<number>(0);

  const {
    viewport: { cols, rows },
    current: { focused },
    instances,
  } = props;

  useEffect(() => {
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

  useEffect(() => {
    const instance = instances[focused];

    if (instance && instance.id !== 'Settings') {
      const { type } = instance.profile;

      const shift = countTrueProperties(instance, ['isExpanded']);

      setShift((type !== 'shell' ? 1 : 0) + shift);
    }
  }, [instances]);

  return (
    <Container $isVisible={isVisible} $shift={shift}>
      {cols}x{rows}
    </Container>
  );
};

export default memo(Viewport);
