import type { ISearchDecorationOptions } from '@xterm/addon-search';
import { getSettings } from 'app/settings';

const { acrylic } = getSettings();

export const theme = {
  foreground: 'rgba(230, 230, 230, 1.0)',
  background: 'rgba(15, 15, 15, 1.0)',
  acrylic: acrylic ? 'rgba(0, 0, 0, 0.70)' : 'rgba(15, 15, 15, 1.0)',
  transparent: acrylic ? 'rgba(0, 0, 0, 0.0)' : 'rgba(15, 15, 15, 1.0)',
  expanded: 'rgba(15, 15, 15, 0.98)',
  border: 'rgba(40, 40, 40, 1.0)',
  overlay: 'rgba(15, 15, 15, 0.45)',
  divider: acrylic ? 'rgba(255, 255, 255, 0.04)' : 'rgba(7, 7, 7, 1.0)',
  dividerHover: acrylic ? 'rgba(255, 255, 255, 0.15)' : 'rgba(35, 35, 35, 1.0)',
  disabled: 'rgba(128, 128, 128, 1.0)',
  cursor: 'rgba(230, 230, 230, 1.0)',
  cursorAccent: 'rgba(0, 0, 0, 0)',
  selectionForeground: 'rgba(230, 230, 230, 1.0)',
  selectionBackground: 'rgba(230, 230, 230, 0.35)',
  popoverForeground: 'rgba(190, 190, 190, 1.0)',
  popoverBackground: 'rgba(15, 15, 15, 1.0)',
  scrollbarThumb: 'rgba(255, 255, 255, 0.10)',
  scrollbarHover: 'rgba(255, 255, 255, 0.20)',
  boxShadow: 'rgba(0, 0, 0, 0.70)',
} as const;

export const decorations: ISearchDecorationOptions = {
  matchBorder: '#00000000',
  matchBackground: '#464646',
  matchOverviewRuler: '#00000000',
  activeMatchBorder: '#00000000',
  activeMatchBackground: '#C3C346',
  activeMatchColorOverviewRuler: '#00000000',
} as const;

declare module 'styled-components' {
  type Theme = typeof theme;

  export interface DefaultTheme extends Theme {}
}
