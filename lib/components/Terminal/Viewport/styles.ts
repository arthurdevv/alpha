import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 10;
  opacity: 0;
  font-size: 0.75rem;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.35s;

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      opacity: 1;
    `}
`;
