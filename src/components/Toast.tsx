// src/components/Toast.tsx
import React from "react";

export type ToastItem = { id: string; message: string; type?: "success" | "error" };
export default function Toast({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
  const base = "rounded-xl border px-4 py-2 shadow-lg";
  const cls =
    item.type === "error"
      ? `${base} border-red-800 bg-red-950/60 text-red-100`
      : `${base} border-emerald-800 bg-emerald-950/60 text-emerald-100`;
  return (
    <div className={cls} role="status">
      <div className="flex items-center gap-3">
        <span className="text-sm">{item.message}</span>
        <button className="ml-auto text-xs opacity-70 hover:opacity-100" onClick={() => onClose(item.id)}>✕</button>
      </div>
    </div>
  );
}
