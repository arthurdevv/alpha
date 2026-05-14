import { styled } from '@linaria/react';

export const Divider = styled.span`
  z-index: 1;
  flex-shrink: 0;
  pointer-events: all;
  background: var(--titlebar, --divider);
  transition: background 0.2s ease 0s;

  &.d {
    background: var(--indicator, --dividerHover);
  }

  &:hover {
    background: var(--indicator, --dividerHover);
    transition: background 0.2s ease-in-out 0.3s;
  }
`;

export const Panes = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;

  &.ew {
    flex-direction: row;

    & > ${Divider} {
      width: 0.3125rem;
      height: 100%;
      cursor: ew-resize;
    }
  }

  &.ns {
    flex-direction: column;

    & > ${Divider} {
      width: 100%;
      height: 0.3125rem;
      cursor: ns-resize;
    }
  }

  &:has(.e) > ${Divider} {
    opacity: 0;
  }
`;

export const Pane = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  pointer-events: all;
  transition: 0.2s ease 0s;
  transition-property: opacity, background;
  opacity: 0.7;
  animation: from-fade-in 0.4s ease 0s;

  &.c {
    opacity: 1;
  }

  &.e {
    position: fixed;
    top: 2.375rem;
    left: 0;
    z-index: 10;
    height: calc(100% - 2.375rem);
    opacity: 0;
    animation: fade-in 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards 0.1s;
  }

  @keyframes from-fade-in {
    from {
      opacity: 0;
    }
  }
`;

export const SplitPane = styled.div`
  position: relative;
  pointer-events: none;
`;

export const Content = styled.div`
  position: relative;
  flex: auto;
  display: block;
  overflow: hidden;
  margin: 0.5rem 0.75rem 0.75rem 1rem;

  .xterm .xterm-viewport,
  .xterm .xterm-scrollable-element {
    background: #00000000 !important;
  }

  .xterm .slider {
    width: 0.25rem !important;
    right: 0 !important;
    left: unset !important;
    background: var(--scrollbar-thumb) !important;
    border-radius: 4px;
    transition: background 0.2s ease 0s;

    &:hover {
      background: var(--scrollbar-hover) !important;
    }
  }
`;

export const Group = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;

  &.c {
    display: block;
  }

  &:has(${Pane}.e) {
    ${Pane}.e {
      pointer-events: all;
      opacity: 1 !important;
      animation: none !important;
    }

    ${Pane}:not(.e) {
      pointer-events: none;
      opacity: 0 !important;
      animation: none !important;
    }
  }
`;
