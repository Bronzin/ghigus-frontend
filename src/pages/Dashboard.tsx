// src/pages/Dashboard.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { getRecentCases } from "../lib/storage";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function groupByDay(recents: { ts: number }[]) {
  const map = new Map<string, number>();
  for (const r of recents) {
    const day = new Date(r.ts);
    // yyyy-mm-dd
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
      day.getDate()
    ).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  // ordina per data crescente
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, count]) => ({ date, count }));
}

export default function Dashboard() {
  const recents = getRecentCases();
  const series = useMemo(() => groupByDay(recents), [recents]);
  const total = recents.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading">Dashboard</h1>
        <Link to="/new" className="btn-primary">+ Nuova pratica</Link>
      </div>

      {/* Chart: pratiche create per giorno */}
      <Card className="h-72">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pratiche create</h2>
          <span className="text-xs text-slate-400">Totale: {total}</span>
        </div>
        {series.length === 0 ? (
          <div className="muted text-sm">Nessun dato ancora. Crea la prima pratica per vedere il trend.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: 12,
                  border: "1px solid #1e293b",
                  color: "#e2e8f0",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Pratiche"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Lista “Pratiche recenti” */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pratiche recenti</h2>
          <span className="text-xs text-slate-400">{recents.length} elementi</span>
        </div>
        {recents.length === 0 ? (
          <div className="muted text-sm">Nessuna pratica recente. Crea la prima dalla pagina “Nuova pratica”.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recents.map((r) => (
              <div key={r.slug} className="py-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-400">
                    slug: <span className="font-mono">{r.slug}</span>
                  </div>
                </div>
                <Link to={`/results/${encodeURIComponent(r.slug)}`} className="btn-ghost">
                  Apri risultati
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
