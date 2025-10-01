// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NewCase from "./pages/NewCase";
import Results from "./pages/Results";          // <— la tua pagina risultati

import { ToastProvider } from "./hooks/useToasts";
import ErrorBoundary from "./components/ErrorBoundary"; // opzionale

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewCase />} />

              {/* Qui la rotta che cerchi: /results/:slug */}
              <Route path="/results/:slug" element={<Results />} />

              {/* (Opzionale) alias se altrove usi :caseId */}
              {/* <Route path="/results/:caseId" element={<Results />} /> */}

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
}
