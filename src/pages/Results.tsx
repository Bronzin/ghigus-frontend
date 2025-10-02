// src/pages/Results.tsx
import React from "react";
import { useParams } from "react-router-dom";
import {
  getSpRiclass,
  getCeRiclass,
  getKpiStandard,
  type RiclassRow,
  type KpiStd,
} from "@/lib/apiWizard";
import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function Results() {
  // accetta /results/:slug o /results/:caseId
  const params = useParams();
  const slug = React.useMemo(
    () => decodeURIComponent((params.slug ?? params.caseId ?? "")),
    [params.slug, params.caseId]
  );

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [sp, setSp] = React.useState<RiclassRow[]>([]);
  const [ce, setCe] = React.useState<RiclassRow[]>([]);
  const [kpi, setKpi] = React.useState<KpiStd[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!slug) {
        setError("Parametro mancante nella rotta (slug/caseId).");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [spR, ceR, kpiR] = await Promise.all([
          getSpRiclass(slug),
          getCeRiclass(slug),
          getKpiStandard(slug).catch(() => [] as KpiStd[]),
        ]);
        if (!cancelled) {
          setSp(spR ?? []);
          setCe(ceR ?? []);
          setKpi(kpiR ?? []);
        }
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) {
    return <div className="p-6">Slug non valido o assente nella URL.</div>;
  }

	if (loading) {
	  return (
		<div className="p-6 space-y-6">
		  <div>
			<div className="text-2xl font-semibold mb-1">Risultati</div>
			<div className="text-sm text-muted-foreground">Caricamento in corso…</div>
		  </div>

		  <div className="space-y-3">
			<Skeleton className="h-5 w-40" />
			<Skeleton className="h-28 w-full" />
		  </div>

		  <div className="space-y-3">
			<Skeleton className="h-5 w-48" />
			<Skeleton className="h-28 w-[92%]" />
		  </div>

		  <div className="space-y-3">
			<Skeleton className="h-5 w-36" />
			<Skeleton className="h-20 w-[70%]" />
		  </div>
		</div>
	  );
	}

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Errore nel caricamento</h2>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
          {/* Pulsante inattivo per ora */}
          <button type="button" className="btn-primary opacity-60 cursor-not-allowed">
            + Crea CNC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con bottone in alto a destra */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Risultati — <span className="font-mono">{slug}</span>
          </h1>
          <p className="text-sm text-muted-foreground">Dati riclassificati e KPI</p>
        </div>
        {/* Uguale stile del pulsante “+ Nuova pratica” (btn-primary) — inattivo */}
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            // TODO: attivare quando disponibile il flusso reale.
            // Per ora lasciamo il click inattivo o mostrata una toast/info.
          }}
        >
          + Crea CNC
        </button>
      </div>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-3">Stato Patrimoniale (riclass.)</h2>
          {sp.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nessun dato SP riclassificato.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Codice</th>
                  <th className="text-left py-2">Descrizione</th>
                  <th className="text-right py-2">Importo</th>
                </tr>
              </thead>
              <tbody>
                {sp.map((r, i) => (
                  <tr key={`sp-${i}`} className="border-t border-border/60">
                    <td className="py-2 font-mono">{r.riclass_code}</td>
                    <td className="py-2">{r.riclass_desc ?? r.riclass_code}</td>
                    <td className="py-2 text-right">{formatAmount(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-3">Conto Economico (riclass.)</h2>
          {ce.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nessun dato CE riclassificato.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Codice</th>
                  <th className="text-left py-2">Descrizione</th>
                  <th className="text-right py-2">Importo</th>
                </tr>
              </thead>
              <tbody>
                {ce.map((r, i) => (
                  <tr key={`ce-${i}`} className="border-t border-border/60">
                    <td className="py-2 font-mono">{r.riclass_code}</td>
                    <td className="py-2">{r.riclass_desc ?? r.riclass_code}</td>
                    <td className="py-2 text-right">{formatAmount(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-3">KPI standard</h2>
          {kpi.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nessun KPI disponibile.</div>
          ) : (
            <ul className="text-sm">
              {kpi.map((k, i) => (
                <li
                  key={`kpi-${i}`}
                  className="border-t border-border/60 py-2 flex items-center justify-between"
                >
                  <span>{k.description ?? k.code}</span>
                  <span className="font-mono">{String(k.value ?? "—")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}

function formatAmount(v: number) {
  try {
    return v.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  } catch {
    return String(v);
  }
}
