// src/hooks/useToasts.tsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import Toast, { ToastItem } from "../components/Toast";

type Ctx = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, any>>({});

  const close = (id: string) => {
    clearTimeout(timers.current[id]); delete timers.current[id];
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const push = (msg: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = { id, message: msg, type };
    setItems((xs) => [item, ...xs]);
    timers.current[id] = setTimeout(() => close(id), 3500);
  };

  const ctx = useMemo<Ctx>(() => ({
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
  }), []);

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {items.map((it) => <Toast key={it.id} item={it} onClose={close} />)}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToasts() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToasts must be used within <ToastProvider>");
  return ctx;
}
