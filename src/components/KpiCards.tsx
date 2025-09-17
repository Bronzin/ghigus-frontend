import React from "react";
import { KPI, Trend } from "../types";

interface KpiCardsProps {
  kpis: KPI[];
}

const trendClasses: Record<Trend, string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  flat: "text-slate-400",
};

const trendIcons: Record<Trend, string> = {
  up: "▲",
  down: "▼",
  flat: "◆",
};

const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {kpis.map((kpi) => {
      // Se il trend manca, usiamo 'flat' come default
      const trend: Trend = kpi.trend ?? "flat";

      return (
        <div
          key={kpi.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
        >
          <div className="text-xs uppercase tracking-wide text-slate-400">
            {kpi.label}
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-3xl font-semibold text-slate-100">
              {kpi.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {kpi.unit && (
                <span className="ml-1 text-base text-slate-400">{kpi.unit}</span>
              )}
            </span>

            <span className={`flex items-center gap-1 text-sm font-medium ${trendClasses[trend]}`}>
              {trendIcons[trend]}
              {typeof kpi.change === "number"
                ? `${kpi.change > 0 ? "+" : ""}${kpi.change.toFixed(1)}%`
                : "stabile"}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

export default KpiCards;
