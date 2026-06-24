import { Component, ReactNode } from "react";

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page">
          <div className="empty">
            <h1>Something went wrong</h1>
            <p className="muted">Refresh the page or return to auctions to continue.</p>
            <a className="button" href="#/auctions">Back to auctions</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
