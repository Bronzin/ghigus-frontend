import React from "react";

export type Trend = "up" | "down" | "flat";
export interface KPI { id: string; label: string; value: number; unit?: string; trend?: Trend; }

const TrendBadge: React.FC<{ trend?: Trend }> = ({ trend }) => {
  if (!trend) return null;
  const txt = trend === "up" ? "↑ up" : trend === "down" ? "↓ down" : "→ flat";
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400">
      {txt}
    </span>
  );
};

const KpiCards: React.FC<{ kpis: KPI[] }> = ({ kpis }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {kpis.map((k) => (
      <div key={k.id} className="card p-4 flex flex-col gap-2">
        <div className="text-sm text-slate-400">{k.label}</div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">
            {k.value}
            {k.unit ? <span className="ml-1 text-base text-slate-400">{k.unit}</span> : null}
          </div>
          <TrendBadge trend={k.trend} />
        </div>
      </div>
    ))}
  </div>
);

export default KpiCards;
export { KpiCards };
