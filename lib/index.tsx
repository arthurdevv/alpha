import { h, render } from 'preact';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import Alpha from './context/alpha';
import GlobalStyle from './styles/global';
import theme from './styles/theme';

import store from './store';
import invokeEvents from './store/events';

invokeEvents();

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Alpha />
    </Provider>
    <GlobalStyle />
  </ThemeProvider>,
  document.getElementById('alpha') as HTMLElement,
);
