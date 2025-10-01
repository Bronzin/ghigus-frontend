import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // opzionale: invia a Sentry/console ecc.
    console.error("Results crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Si è verificato un problema</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prova a ricaricare la pagina o a rieseguire l’elaborazione.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
