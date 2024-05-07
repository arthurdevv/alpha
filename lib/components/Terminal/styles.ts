import styled, { css } from 'styled-components';

export const Group = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
  flex: auto;
  display: flex;
`;

export const Container = styled.div<{ $isCurrent: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -9999em;
  flex: auto;
  display: flex;
  overflow: hidden;
  background: ${({ theme }) => theme.transparent};

  ${({ $isCurrent }) =>
    $isCurrent &&
    css`
      left: 0;
      z-index: 1;
    `}
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
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.scrollbarHover};
    }
  }
`;
