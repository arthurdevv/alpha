import styled, { css } from 'styled-components';
import { Content as _Content } from 'components/Modal/styles';
import { AnsiColor } from 'components/Settings/Appearance/styles';
import { Container } from 'components/Modal/ContextMenu/Terminal/styles';

export { Container };

export const Content = styled(_Content)`
  backdrop-filter: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(12px);
  }
`;

export const Grid = styled.div`
  padding: 0.5rem;
  gap: 0.375rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

export const Color = styled(AnsiColor)<{ $text?: boolean }>`
  position: relative;
  cursor: pointer;
  color: ${props =>
    props.$text ? props.theme.foreground : props.theme.disabled};
  transition: color 0.2s ease 0s;

  & svg {
    width: 1.125rem;
    height: 1.125rem;
    color: inherit;
  }

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const CurrentColor = styled(AnsiColor)<{
  $isPickingColor?: boolean;
  $none?: boolean;
}>`
  width: calc(100% - 1rem);
  margin: 0 0.5rem ${props => (props.$isPickingColor ? '0.625rem' : '0.5rem')}
    0.5rem;
  font-size: 0.625rem;
  transition: background-color 0.2s ease 0s;

  ${props =>
    props.$none &&
    css`
      --cell: 5px;
      --c1: ${props => props.theme.border};
      --c2: ${props => props.theme.borderWindow};

      background: repeating-conic-gradient(var(--c1) 0 25%, var(--c2) 0 50%);
      background-size: calc(var(--cell) * 2) calc(var(--cell) * 2);
    `}
`;
