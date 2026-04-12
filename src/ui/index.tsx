import { Component } from 'preact';
import { createRoot } from 'react-dom/client';

import { reportError } from 'shared/error-reporter';

import Alpha from './alpha';
import { setupI18n } from './services/i18n';

import './styles/globals.css';
import './styles/theme.css';

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

  createRoot(document.getElementById('alpha')!).render(
    <ErrorBoundary>
      <Alpha />
    </ErrorBoundary>,
  );
}

mount();
