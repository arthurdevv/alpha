import styled, { createGlobalStyle } from 'styled-components';
import 'xterm/css/xterm.css';

export const Content = styled.div`
  position: relative;
  width: 100vw;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
`;

const GlobalStyle = createGlobalStyle`
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
    -webkit-font-smoothing: antialiased;
  }

  #alpha {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    font: 400 16px 'Inter', sans-serif;
    color: ${props => props.theme.foreground};
    background: ${props => props.theme.background};
  }

  *::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollbar.thumb};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.disabled};
    }
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  @font-face {
    font-family: 'Inter';
    font-weight: 400;
    font-style: normal;
    src: url('lib/styles/fonts/Inter.ttf') format('truetype');
  }
`;

export default GlobalStyle as any;
