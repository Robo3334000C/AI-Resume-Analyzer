import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import App from "./App.tsx";
import "./index.css";
import { usePuterStore } from "./store/puterStore";
import React from "react";

// Material Web Components
import '@material/web/button/filled-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/outlined-text-field.js';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', background: '#fee', color: '#c00', fontFamily: 'monospace', position: 'fixed', inset: 0, zIndex: 9999 }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error?.toString()}</pre>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const RootComponent = () => {
    const initialize = usePuterStore((state) => state.initialize);
    const isReady = usePuterStore((state) => state.isReady);

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-400 animate-pulse font-bold uppercase tracking-widest text-[10px]">Initializing ResuMe Intel...</p>
            </div>
        );
    }

    return <App />;
};

const container = document.getElementById("root");
if (container) {
    createRoot(container).render(
        <ErrorBoundary>
            <RootComponent />
        </ErrorBoundary>
    );
}
