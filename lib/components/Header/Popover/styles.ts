import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  pointer-events: none;
  display: flex;
  justify-content: center;
`;

export const Content = styled.span`
  position: fixed;
  height: 1.875rem;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  top: calc(2.275rem + 6px);
  z-index: 1000;
  opacity: 0;
  line-height: 1rem;
  font-size: 0.75rem;
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.foreground};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  box-shadow: ${({ theme }) => theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.55s;
`;

export const Keys = styled.div`
  margin-left: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
  display: ${({ hidden }) => hidden && 'none'};
`;

export const KeyItem = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.popoverForeground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
`;

export const Arrow = styled.span`
  position: fixed;
  width: 0;
  height: 0;
  opacity: 0;
  z-index: 9999;
  top: calc(2.275rem - 5px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid transparent;
  border-bottom-color: ${({ theme }) => theme.border};
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.55s;
  -webkit-mask: none !important;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: -5px;
    border: 7px solid transparent;
    border-bottom-color: ${({ theme }) => theme.background};
  }
`;
