import '@xterm/xterm/css/xterm.css';
import styled, { createGlobalStyle } from 'styled-components';

import {
  Actions,
  DragRegion,
  Container as Header,
} from 'ui/components/Header/styles';
import { Group, Container as Tab } from 'ui/components/Header/Tab/styles';
import { Container as Indicators } from 'ui/components/Terminal/Indicators/styles';
import { Content as TermContent } from 'ui/components/Terminal/styles';

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
    font: 400 16px 'Geist', sans-serif;
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
    font-family: 'Geist';
    font-weight: 100 1000;
    font-style: normal;
    src: url('ui/styles/fonts/Geist.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Hack';
    font-weight: 400;
    font-style: normal;
    src: url('ui/styles/fonts/Hack-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Hack';
    font-weight: 500 900;
    font-style: normal;
    src: url('ui/styles/fonts/Hack-Bold.ttf') format('truetype');
  }

  html {
    &[zen-mode='true'] {
      ${Actions} {
        display: none;
      }
    }

    &[zen-mode-show-tabs='single'] {
      ${Group} {
        position: fixed;
        height: 2.375rem;
        width: 100%;
        justify-content: center;
        transition: width .2s ease 0s;
      }

      ${DragRegion} {
        position: fixed;
        width: 100%;
        height: 2.375rem;
        z-index: 999;
      }

      ${Tab}:not(.current) {
        width: 0;
        opacity: 0;
        pointer-events: none;
        transform: scaleX(0.98);
        transition: opacity .2s ease 0s, transform .2s ease 0s;
      }
    }

    &[zen-mode-show-tabs='hidden'] {
      ${Header} {
        position: fixed;
        opacity: 0 !important;
        pointer-events: none;
        transition: opacity .2s ease 0s;
      }

      ${TermContent} {
        margin: 1rem 0.75rem 0.75rem 1rem;
      }
    }

    &[zen-mode-hide-indicators='true'] {
      ${Indicators} {
        opacity: 0;
        transform: translateY(-2px);
        pointer-events: none;
        transition: opacity .2s ease 0s;
      }
    }
  }
`;
