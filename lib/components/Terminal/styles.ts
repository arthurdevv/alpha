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
`;

export const Panes = styled.div<{ $cursor: string; $isDragging: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

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

export const Pane = styled.div<{ $isCurrent?: boolean; $isExpanded?: boolean }>`
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

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      position: fixed;
      height: calc(100% - 2.375rem);
      top: 2.375rem;
      left: 0;
      z-index: 10;
      background: ${props => props.theme.expanded};
      animation: ${keyframes`
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      `} 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards 0s;

      & > div:last-of-type {
        opacity: 1;
        transition-delay: 0.35s;
      }
    `}
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

export const Indicator = styled.div`
  position: fixed;
  width: 1.875rem;
  height: 1.875rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 10;
  opacity: 0;
  cursor: default;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.acrylic};
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  border-radius: 4px;
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
`;
