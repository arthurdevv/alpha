import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean; $shifted: boolean }>`
  position: fixed;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 10;
  opacity: 0;
  font-size: 0.75rem;
  cursor: default;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.acrylic};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay: 0.35s, 0s;
  transition-property: opacity, right;

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      opacity: 1;
    `}

  ${({ $shifted }) =>
    $shifted &&
    css`
      right: 3.125rem;
      transition-delay: 0.1s, 0s;
    `}
`;
