// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NewCase from "./pages/NewCase";
import Results from "./pages/Results";
import { ToastProvider } from "./hooks/useToasts";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<NewCase />} />
            <Route path="/results/:caseId" element={<Results />} />
            <Route path="*" element={<Navigate to="/new" replace />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}
