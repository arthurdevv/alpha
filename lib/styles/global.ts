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
    font: 400 16px 'Inter', sans-serif;
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
    color: ${props => props.theme.foreground};
    background: ${props => props.theme.acrylic};
  }

  input {
    font-family: inherit;
    font-weight: 400;
    color: ${props => props.theme.foreground};
    border: none;
    outline: none;
    appearance: none;
    background: transparent;
  }

  *::selection {
    color: ${props => props.theme.selectionForeground};
    background: ${props => props.theme.selectionBackground};
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

  @font-face {
    font-family: 'Fira Code';
    font-weight: 100 1000;
    font-style: normal;
    src: url('lib/styles/fonts/FiraCode.ttf') format('truetype');
  }
`;
