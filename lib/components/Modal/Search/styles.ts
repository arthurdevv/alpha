import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  width: 100%;
  max-width: 31.25rem;
  top: 10vh;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%) scale(0.99);
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  transition-property: transform, opacity;

  &:not(.focused) {
    opacity: 0.8;
  }

  ${({ $isVisible }) =>
    $isVisible
      ? css`
          opacity: 1;
          transform: translateX(-50%) scale(1);
        `
      : css`
          opacity: 0;
          transform: translateX(-50%) scale(0.98);
        `}
`;

export const Content = styled.div`
  position: relative;
  height: 3rem;
  padding: 1rem;
  gap: 0.875rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

export const Count = styled.span`
  font-size: 0.75rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.disabled};
`;

export const Controls = styled.div`
  gap: 0.625rem;
  display: inline-flex;
`;

export const Control = styled.div`
  height: 1rem;
  cursor: pointer;
  overflow: hidden;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.background};

  & svg {
    color: ${({ theme }) => theme.disabled};
    transition: color 0.2s ease 0s;
  }

  &:hover {
    svg {
      color: ${({ theme }) => theme.foreground};
    }

    :last-child {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
    }
  }

  &.actived svg {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Label = styled.div`
  position: fixed;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  top: 3.125rem;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  box-shadow: ${({ theme }) => theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s ease 0s;

  & span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Arrow = styled.div`
  position: absolute;
  top: -0.75rem;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid transparent;
  border-bottom-color: ${({ theme }) => theme.border};
  transition: opacity 0.2s ease 0s;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    border: 7px solid transparent;
    border-bottom-color: ${({ theme }) => theme.background};
  }
`;
