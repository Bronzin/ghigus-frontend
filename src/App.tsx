// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NewCase from "./pages/NewCase";
import Results from "./pages/Results";
import Landing from "./pages/Landing";

import { ToastProvider } from "./hooks/useToasts";
import ErrorBoundary from "./components/ErrorBoundary";

// piccolo wrapper per usare <Layout> con Route.element
function PageWithLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <Routes>
            {/* Landing SENZA sidebar/layout */}
            <Route path="/" element={<Landing />} />

            {/* Pagine applicative CON sidebar/layout */}
            <Route
              path="/dashboard"
              element={
                <PageWithLayout>
                  <Dashboard />
                </PageWithLayout>
              }
            />
            <Route
              path="/new"
              element={
                <PageWithLayout>
                  <NewCase />
                </PageWithLayout>
              }
            />
            <Route
              path="/results/:slug"
              element={
                <PageWithLayout>
                  <Results />
                </PageWithLayout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
}
