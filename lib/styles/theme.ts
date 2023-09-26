import 'styled-components';

export const theme = {
  foreground: 'rgba(230, 230, 230, 1.0)',
  background: 'rgba(15, 15, 15, 1.0)',
  border: 'rgba(40, 40, 40, 1.0)',
  divider: 'rgba(230, 230, 230, 0.08)',
  disabled: 'rgba(128, 128, 128, 1.0)',
  cursor: 'rgba(230, 230, 230, 1.0)',
  cursorAccent: 'rgba(0, 0, 0, 0)',
  selectionForeground: 'rgba(230, 230, 230, 1.0)',
  selectionBackground: 'rgba(230, 230, 230, 0.15)',
  popoverForeground: 'rgba(190, 190, 190, 1.0)',
  popoverBackground: 'rgba(15, 15, 15, 1.0)',
  scrollbarThumb: 'rgba(255, 255, 255, 0.10)',
  scrollbarHover: 'rgba(255, 255, 255, 0.20)',
  boxShadow: 'rgba(0, 0, 0, 0.15)',
} as const;

declare module 'styled-components' {
  type Theme = typeof theme;

  export interface DefaultTheme extends Theme {}
}
