import { h, render } from 'preact';
import { ThemeProvider } from 'styled-components';

import Alpha from './components/alpha';
import GlobalStyle from './styles/global';
import { theme } from './styles/theme';

render(
  <ThemeProvider theme={theme}>
    <Alpha />
    <GlobalStyle />
  </ThemeProvider>,
  document.getElementById('alpha') as HTMLElement,
);
