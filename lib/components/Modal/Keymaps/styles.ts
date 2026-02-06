import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  max-width: 24rem;
  max-height: calc(100% - 4rem);
  top: calc(50% + 1.5rem);
  right: 0;
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
          transform: translateY(-50%) scale(1);
        `
      : css`
          opacity: 0;
          transform: translateY(-50%) scale(0.98);
        `}
`;

export const Content = styled.div`
  position: relative;
  max-height: calc(100% - 4rem);
  padding: 0.25rem 0.25rem 0.5rem 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => props.theme.modal};
  border-top: 1px solid ${props => props.theme.border};
  border-left: 1px solid ${props => props.theme.border};
  border-bottom: 1px solid ${props => props.theme.border};
  border-radius: 4px 0 0 4px;
  backdrop-filter: ${props => props.theme.modalBackdrop};
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
`;

export const Item = styled.li`
  height: 2.25rem;
  padding: 0 1rem 0 1.5rem;
  font-size: 0.813rem;
  overflow: hidden;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease 0s;

  &:hover {
    background: transparent !important;
  }
`;
