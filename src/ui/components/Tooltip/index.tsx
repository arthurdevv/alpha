import { cx } from '@linaria/core';
import { useState, useRef, useEffect } from 'preact/compat';

import { Arrow, Container, Content, Key, Keys, Label, Wrapper } from './styles';

interface TooltipProps {
  label: string;
  keys?: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: preact.ComponentChildren;
}

export default function Tooltip({ label, keys, position, children }: TooltipProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClearTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseEnter = () => {
    handleClearTimeout();

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    handleClearTimeout();

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  useEffect(() => handleClearTimeout(), []);

  return (
    <Container onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <Content className={cx(visible && 'v')} role="tooltip">
        <Arrow className={position} />
        <Wrapper className={cx(keys && 'k')}>
          <Label>{label}</Label>
          {keys && (
            <Keys>
              {keys.map((key, index) => (
                <Key key={index}>{key}</Key>
              ))}
            </Keys>
          )}
        </Wrapper>
      </Content>
    </Container>
  );
}
