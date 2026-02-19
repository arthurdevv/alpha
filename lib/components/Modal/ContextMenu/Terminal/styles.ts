import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  z-index: 100;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  transition-property: transform, opacity;

  ${props =>
    props.$isVisible
      ? css`
          opacity: 1;
          transform: scale(1);
        `
      : css`
          pointer-events: none;
          opacity: 0;
          transform: scale(0.98);
        `}
`;

export const Content = styled.div`
  position: relative;
  overflow: auto;
  background: ${props => props.theme.modal};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  backdrop-filter: ${props => props.theme.modalBackdrop};
`;

export const Actions = styled.ul`
  height: 2.375rem;
  gap: 1rem;
  padding: 0.8125rem;
  display: inline-flex;
`;

export const Action = styled.li`
  width: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};

    :last-child {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
    }
  }
`;

export const Label = styled.div<{ $keys: string[] }>`
  position: fixed;
  width: max-content;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  top: 3rem;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.modal};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s ease 0s;

  ${({ $keys }) =>
    $keys.length > 0
      ? css`
          padding: 0.25rem 0.25rem 0.25rem 0.5rem;
        `
      : css`
          padding: 0.25rem 0.5rem;
        `}

  & span {
    font-size: 0.75rem;
    color: ${props => props.theme.foreground};
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
  border-bottom-color: ${props => props.theme.border};
  transition: opacity 0.2s ease 0s;

  &::before {
    content: '';
    position: absolute;
    top: -0.3125rem;
    border: 7px solid transparent;
    border-bottom-color: ${props => props.theme.transparent};
  }
`;

export const Keys = styled.div<{ $hidden?: boolean }>`
  margin-left: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
  display: ${props => props.$hidden && 'none'};
`;

export const Key = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
`;
