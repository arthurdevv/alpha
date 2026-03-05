import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  pointer-events: none;
  display: flex;
  justify-content: center;
`;

export const Content = styled.span<{ $keys: string[]; $label: string }>`
  position: fixed;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  top: calc(2.275rem + 6px);
  z-index: 100;
  opacity: 0;
  line-height: 1rem;
  font-size: 0.75rem;
  pointer-events: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${props => props.theme.foreground};
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s ease 0s;

  ${({ $label }) =>
    $label === 'Close'
      ? css`
          right: 0.5rem;
        `
      : $label === 'New terminal' || $label === 'Profiles'
        ? css`
            padding: 0.25rem 0.25rem 0.25rem 0.5rem;
            left: 0.5rem;

            &.auto {
              left: auto !important;
            }
          `
        : $label === 'Settings' &&
          css`
            padding: 0.25rem 0.25rem 0.25rem 0.5rem;
          `}

  ${({ $keys }) =>
    $keys.length === 0 &&
    css`
      padding: 0.25rem 0.5rem;
    `}
`;

export const Keys = styled.div<{ $hidden?: boolean }>`
  margin-left: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
  display: ${props => props.$hidden && 'none'};
`;

export const KeyItem = styled.div<{ $isHint?: boolean }>`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.popoverForeground};
  background: ${props => props.theme.codeAcrylic};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;

  ${({ $isHint }) =>
    $isHint &&
    css`
      height: 1rem;
      padding: 0 0.1875rem;
      font-size: 0.625rem;
    `}
`;

export const Arrow = styled.span`
  position: fixed;
  width: 0;
  height: 0;
  opacity: 0;
  z-index: 200;
  top: calc(2.275rem - 5px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid transparent;
  border-bottom-color: ${props => props.theme.border};
  transition: opacity 0.2s ease 0s;
  -webkit-mask: none !important;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: -5px;
    border: 7px solid transparent;
    border-bottom-color: ${props => props.theme.background};
  }
`;
