import { Component, type ReactNode } from 'react';
import { useAgentWatch } from './hooks/useAgentWatch';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-red-500 text-lg font-bold mb-2">Error</h1>
          <pre className="text-sm text-gray-400 font-mono">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  useAgentWatch();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
