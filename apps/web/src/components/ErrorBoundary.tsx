import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

function DefaultFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong.</h2>
      <p>Please refresh the page to try again.</p>
    </div>
  );
}

/**
 * Catches unhandled errors in the React component tree and renders a fallback UI.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * <ErrorBoundary fallback={<p>Oops!</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Uncaught error:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }
    return this.props.children;
  }
}
