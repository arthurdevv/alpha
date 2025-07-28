import styled, { css, keyframes } from 'styled-components';

export const Group = styled.div<{ $isCurrent: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;

  ${({ $isCurrent }) =>
    $isCurrent &&
    css`
      display: block;
    `}

  &:has([role="presentation"].expanded) *[role="presentation"]:not(.expanded) {
    opacity: 0;
  }
`;

export const Panes = styled.div<{ $cursor: string; $isDragging: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

  &:has(.expanded) > span {
    opacity: 0;
  }

  ${({ $cursor }) =>
    $cursor === 'ew-resize'
      ? css`
          flex-direction: row;

          & > span {
            width: 6px;
            height: 100%;
            cursor: ${$cursor};
          }
        `
      : css`
          flex-direction: column;

          & > span {
            width: 100%;
            height: 6px;
            cursor: ${$cursor};
          }
        `}

  ${props =>
    props.$isDragging &&
    css`
      cursor: ${props.$cursor};
    `}
`;

export const Pane = styled.div<{ $isCurrent?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  opacity: 0.7;
  pointer-events: all;
  transition: 0.2s ease 0s;
  transition-property: opacity, background;

  ${({ $isCurrent }) =>
    $isCurrent &&
    css`
      opacity: 1;
    `}

  &.expanded {
    position: fixed;
    height: calc(100% - 2.375rem);
    top: 2.375rem;
    left: 0;
    z-index: 10;
    opacity: 0;
    animation: ${keyframes`
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      `} 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards 0.1s;
  }
`;

export const SplitPane = styled.div`
  position: relative;
  pointer-events: none;
`;

export const Content = styled.div`
  position: relative;
  margin: 0.875rem;
  flex: auto;
  display: block;
  overflow: hidden;

  .xterm .xterm-viewport {
    background: #00000000 !important;
  }

  *::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
    display: block;
  }

  *::-webkit-scrollbar-corner,
  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollbarThumb};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.scrollbarHover};
    }
  }
`;

export const Divider = styled.span`
  z-index: 1;
  flex-shrink: 0;
  pointer-events: all;
  background: ${props => props.theme.divider};
  transition: background 0.2s ease 0s;

  &.dragging {
    background: ${props => props.theme.dividerHover};
  }

  &:hover {
    background: ${props => props.theme.dividerHover};
    transition: background 0.2s ease-in-out 0.3s;
  }
`;
