import styled, { createGlobalStyle } from 'styled-components';
import '@xterm/xterm/css/xterm.css';

export const Content = styled.div`
  position: relative;
  width: 100vw;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
`;

export default createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
  };

  html {
    line-height: 1.15;
    font-family: sans-serif;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  };

  body {
    overflow: hidden;
    user-select: none;
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
  }

  #alpha {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    font: 400 16px 'Inter', sans-serif;
    color: ${({ theme }) => theme.foreground};
    background: ${({ theme }) => theme.acrylic};
  }

  input {
    font-family: inherit;
    font-weight: 400;
    color: ${({ theme }) => theme.foreground};
    border: none;
    outline: none;
    appearance: none;
    background: transparent;
  }

  *::selection {
    color: ${({ theme }) => theme.selectionForeground};
    background: ${({ theme }) => theme.selectionBackground};
  }

  *::-webkit-scrollbar {
    display: none
  }

  @font-face {
    font-family: 'Inter';
    font-weight: 100 1000;
    font-style: normal;
    src: url('lib/styles/fonts/Inter.ttf') format('truetype');
  }
`;
