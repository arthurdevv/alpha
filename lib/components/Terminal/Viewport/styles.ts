import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean; $shift: number }>`
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
  background: ${props => props.theme.modal};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  backdrop-filter: ${props => props.theme.modalBackdrop};
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay: 0.35s, 0s;
  transition-property: opacity, right;

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      opacity: 1;
    `}

  ${({ $shift }) =>
    $shift &&
    css`
      right: ${$shift === 1 ? '3.125rem' : '5.25rem'};
      transition-delay: 0.1s, ${$shift === 1 ? '0.1s' : '0s'};
    `}
`;
