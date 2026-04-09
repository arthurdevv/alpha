import { Component, render } from 'preact';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import { reportError } from 'shared/error-reporter';
import GlobalStyle from 'ui/styles/global';
import { theme } from 'ui/styles/theme';

import Alpha from './alpha';
import { setupI18n } from './services/i18n';

class ErrorBoundary extends Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    reportError(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

async function mount() {
  await setupI18n();

  createRoot(document.getElementById('alpha') as HTMLElement).render(
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Alpha />
        <GlobalStyle />
      </ThemeProvider>
    </ErrorBoundary>,
  );
}

mount();
