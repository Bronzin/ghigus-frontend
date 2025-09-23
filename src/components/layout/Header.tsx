import React from "react";

export default function Header() {
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
      <div className="text-sm text-slate-400">MVP connected to backend</div>
      <div className="text-xs text-slate-500">v0.1</div>
    </header>
  );
}
