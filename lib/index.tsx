import { Component, render } from 'preact';
import { ThemeProvider } from 'styled-components';

import settings from 'app/settings';
import { reportError } from 'shared/error-reporter';

import Alpha from './components/alpha';
import GlobalStyle from './styles/global';
import { theme } from './styles/theme';
import initRendererAnalytics from './analytics';

initRendererAnalytics(settings);

class ErrorBoundary extends Component<{ children: React.ReactNode }> {
  componentDidCatch(error: Error) {
    reportError(error);
  }

  render() {
    return this.props.children;
  }
}

render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Alpha />
      <GlobalStyle />
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('alpha') as HTMLElement,
);
