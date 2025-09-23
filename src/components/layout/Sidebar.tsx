// src/components/layout/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getRecentCases } from "../../lib/storage";
import ghigo from "../../assets/ghigo.png"; // <<-- immagine cane

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/new", label: "Nuova pratica" },
];

export default function Sidebar() {
  const [recents, setRecents] = useState(getRecentCases());

  useEffect(() => {
    const refresh = () => setRecents(getRecentCases());
    window.addEventListener("ghigus:recents-updated", refresh);
    window.addEventListener("storage", refresh); // cross-tab sync
    return () => {
      window.removeEventListener("ghigus:recents-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <aside className="h-full w-64 border-r border-slate-800 bg-slate-950/60">
      {/* Brand: logo cane + testo "Ghigus" TUTTO cliccabile → / */}
      <Link
        to="/"
        aria-label="Torna alla Dashboard"
        className="mx-2 mt-2 mb-1 flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-900 transition"
      >
        <img
          src={ghigo}
          alt="Logo Ghigus"
          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
        />
        <div className="text-lg font-semibold tracking-tight">Ghigus</div>
        <span className="ml-2 text-xs rounded-full px-2 py-0.5 border border-slate-700 text-slate-300">
          Beta
        </span>
      </Link>

      {/* Nav principale */}
      <nav className="px-2 py-2 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900"
              }`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Recenti nella sidebar (se presenti) */}
      {recents.length > 0 && (
        <div className="mt-4 px-2">
          <div className="text-xs text-slate-500 px-3 mb-1">Recenti</div>
          <ul className="space-y-1">
            {recents.slice(0, 5).map((r) => (
              <li key={r.slug}>
                <NavLink
                  to={`/results/${encodeURIComponent(r.slug)}`}
                  className="block px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-900"
                  title={r.slug}
                >
                  <span className="truncate block">{r.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono truncate block">
                    {r.slug}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
