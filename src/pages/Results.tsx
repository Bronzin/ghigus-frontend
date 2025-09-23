// src/pages/Results.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { compute } from "../lib/apiWizard";
import type { ComputeResponse } from "../lib/apiWizard";
import KpiCards from "../components/KpiCards";
import Card from "../components/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

type LocationState = { compute?: ComputeResponse };

export default function Results() {
  const { caseId } = useParams<{ caseId: string }>();
  const location = useLocation();
  const navState = (location.state || {}) as LocationState;

  const [data, setData] = useState<ComputeResponse | null>(navState.compute ?? null);
  const [loading, setLoading] = useState<boolean>(!navState.compute);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (data || !caseId) return;
      setLoading(true); setError(null);
      try { const res = await compute(caseId); if (!cancelled) setData(res); }
      catch (e: any) { if (!cancelled) setError(String(e?.message || e)); }
      finally { if (!cancelled) setLoading(false); }
    }
    load(); return () => { cancelled = true; };
  }, [caseId, data]);

  const cncTotal = useMemo(() => (data ? data.cnc.reduce((s, r) => s + r.amount, 0) : 0), [data]);
  const lgTotal  = useMemo(() => (data ? data.lg .reduce((s, r) => s + r.amount, 0) : 0), [data]);

  // === Serie "forecast" stile zip (MVP): sintetica, derivata dai totali CNC/LG.
  // Quando avremo una serie temporale dal backend, basta sostituire 'series' con i dati reali.
  const series = useMemo(() => {
    const months = ["Gen","Feb","Mar","Apr","Mag","Giu"];
    const baseStart = Math.max(1, Math.round((cncTotal + lgTotal) / 14)); // base iniziale
    return months.map((m, i) => {
      const base = Math.round(baseStart * (1 + i * 0.12));         // trend leggero ↑
      return {
        month: m,
        base,
        optimistic: Math.round(base * 1.10),
        pessimistic: Math.round(base * 0.90),
      };
    });
  }, [cncTotal, lgTotal]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="heading">Risultati</h1>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-brand-500 hover:underline">← Dashboard</Link>
          <Link to="/new" className="text-sm text-brand-500 hover:underline">+ Nuova pratica</Link>
        </div>
      </div>
      {caseId && <div className="text-xs muted">Case: <span className="font-mono">{caseId}</span></div>}

      {loading && <Card>Caricamento…</Card>}
      {error && <Card className="border-red-800 bg-red-950/50 text-red-200">Errore: {error}</Card>}

      {!loading && !error && data && (
        <>
          {/* KPI */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">KPI</h2>
            <Card><KpiCards kpis={data.kpis} /></Card>
          </section>

          {/* === NUOVA SEZIONE === Trend pratica (line/area chart stile zip) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trend pratica</h2>
              <div className="text-xs muted">Serie sintetica (MVP)</div>
            </div>
            <Card className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: 12,
                      border: "1px solid #1e293b",
                      color: "#e2e8f0",
                    }}
                  />
                  <Area type="monotone" dataKey="optimistic" stroke="#34d399" fill="none" strokeWidth={2} />
                  <Area type="monotone" dataKey="base" stroke="#38bdf8" fill="url(#colorBase)" strokeWidth={2} />
                  <Area type="monotone" dataKey="pessimistic" stroke="#f87171" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </section>

          {/* CNC */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Distribuzione CNC</h2>
              <div className="text-xs muted">Totale: {cncTotal.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="py-2 pr-4">Label</th><th className="py-2 pr-4">% </th><th className="py-2 pr-4">Importo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cnc.map((r, idx) => (
                      <tr key={idx} className="border-t border-slate-800">
                        <td className="py-2 pr-4">{r.label}</td>
                        <td className="py-2 pr-4">{(r.percent * 100).toFixed(1)}%</td>
                        <td className="py-2 pr-4">{r.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-slate-800 font-medium">
                      <td className="py-2 pr-4 text-right" colSpan={2}>Totale</td>
                      <td className="py-2 pr-4">{cncTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              <Card className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cnc} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor:'#0f172a', borderRadius:12, border:'1px solid #1e293b', color:'#e2e8f0' }} />
                    <Bar dataKey="amount" name="Importo" fill="#38bdf8" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </section>

          {/* LG */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Distribuzione LG</h2>
              <div className="text-xs muted">Totale: {lgTotal.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="py-2 pr-4">Label</th><th className="py-2 pr-4">% </th><th className="py-2 pr-4">Importo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lg.map((r, idx) => (
                      <tr key={idx} className="border-t border-slate-800">
                        <td className="py-2 pr-4">{r.label}</td>
                        <td className="py-2 pr-4">{(r.percent * 100).toFixed(1)}%</td>
                        <td className="py-2 pr-4">{r.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-slate-800 font-medium">
                      <td className="py-2 pr-4 text-right" colSpan={2}>Totale</td>
                      <td className="py-2 pr-4">{lgTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              <Card className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.lg} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor:'#0f172a', borderRadius:12, border:'1px solid #1e293b', color:'#e2e8f0' }} />
                    <Bar dataKey="amount" name="Importo" fill="#38bdf8" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
