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
  :root {
    --theme-foreground: ${props => props.theme.foreground};
    --theme-background: ${props => props.theme.background};
    --theme-acrylic: ${props => props.theme.acrylic};
    --theme-transparent: ${props => props.theme.transparent};
    --theme-icon: ${props => props.theme.icon};
    --theme-iconOpaque: ${props => props.theme.iconOpaque};
    --theme-border: ${props => props.theme.border};
    --theme-borderWindow: ${props => props.theme.borderWindow};
    --theme-overlay: ${props => props.theme.overlay};
    --theme-divider: ${props => props.theme.divider};
    --theme-divider-hover: ${props => props.theme.dividerHover};
    --theme-disabled: ${props => props.theme.disabled};
    --theme-cursor: ${props => props.theme.cursor};
    --theme-cursorAccent: ${props => props.theme.cursorAccent};
    --theme-selectionForeground: ${props => props.theme.selectionForeground};
    --theme-selectionBackground: ${props => props.theme.selectionBackground};
    --theme-popoverForeground: ${props => props.theme.popoverForeground};
    --theme-popoverBackground: ${props => props.theme.popoverBackground};
    --theme-scrollbar-thumb: ${props => props.theme.scrollbarThumb};
    --theme-scrollbar-hover: ${props => props.theme.scrollbarHover};
    --theme-boxShadow: ${props => props.theme.boxShadow};
    --theme-code: ${props => props.theme.code};
    --theme-codeOpaque: ${props => props.theme.codeOpaque};
    --theme-codeTranslucent: ${props => props.theme.codeTranslucent};
    --theme-codeAcrylic: ${props => props.theme.codeAcrylic};
    --theme-badge: ${props => props.theme.badge};
    --theme-keys: ${props => props.theme.keys};
    --theme-modal: ${props => props.theme.modal};
    --theme-modalBackdrop: ${props => props.theme.modalBackdrop};
  }

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
