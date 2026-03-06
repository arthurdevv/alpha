import { Component, render } from 'preact';
import { ThemeProvider } from 'styled-components';

import settings from 'main/settings';
import { reportError } from 'shared/error-reporter';
import initRendererAnalytics from 'ui/services/analytics';
import GlobalStyle from 'ui/styles/global';
import { theme } from 'ui/styles/theme';

import Alpha from './alpha';

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
