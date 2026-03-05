import styled, { css, keyframes } from 'styled-components';

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
            width: 0.3125rem;
            height: 100%;
            cursor: ${$cursor};
          }
        `
      : css`
          flex-direction: column;

          & > span {
            width: 100%;
            height: 0.3125rem;
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
  opacity: ${({ $isCurrent }) => ($isCurrent ? 1 : 0.7)};
  pointer-events: all;
  transition: 0.2s ease 0s;
  transition-property: opacity, background;
  animation: ${keyframes`
      0% {
        opacity: 0;
      }
  `} 0.4s ease 0s;

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
  margin: 0.5rem 0.75rem 0.75rem 1rem;
  flex: auto;
  display: block;
  overflow: hidden;

  .xterm .xterm-viewport,
  .xterm .xterm-scrollable-element {
    background: #00000000 !important;
  }

  .xterm .slider {
    width: 0.25rem !important;
    right: 0 !important;
    left: unset !important;
    background: ${props => props.theme.scrollbarThumb} !important;
    border-radius: 4px;
    transition: background 0.2s ease 0s;

    &:hover {
      background: ${props => props.theme.scrollbarHover} !important;
    }
  }
`;

export const Divider = styled.span`
  z-index: 1;
  flex-shrink: 0;
  pointer-events: all;
  background: var(--header, ${props => props.theme.divider});
  transition: background 0.2s ease 0s;

  &.dragging {
    background: var(--indicator, ${props => props.theme.dividerHover});
  }

  &:hover {
    background: var(--indicator, ${props => props.theme.dividerHover});
    transition: background 0.2s ease-in-out 0.3s;
  }
`;

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

  &:has(${Pane}.expanded) {
    ${Pane}.expanded {
      opacity: 1 !important;
      animation: none !important;
      pointer-events: all;
    }

    ${Pane}:not(.expanded) {
      opacity: 0 !important;
      animation: none !important;
      pointer-events: none;
    }
  }
`;
