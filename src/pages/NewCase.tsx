// src/pages/NewCase.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDrop from "../components/FileDrop";
import Card from "../components/Card";
import { useToasts } from "../hooks/useToasts";
import { addRecentCase } from "../lib/storage";
import { createCase, uploadTb, uploadXbrl, ingest, compute } from "../lib/apiWizard";
import type { ComputeResponse } from "../lib/apiWizard";

const steps = ["Metadati", "Upload TB", "Upload XBRL", "Ingest & Compute"];
const defaultCompany = "1";
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");

export default function NewCase() {
  const navigate = useNavigate();
  const toast = useToasts();
  const [step, setStep] = useState<number>(1);

  // metadati
  const [name, setName] = useState<string>("debug 6");
  const [slug, setSlug] = useState<string>("debug-6");
  const [companyId, setCompanyId] = useState<string>(defaultCompany);

  // files
  const [tbFile, setTbFile] = useState<File | null>(null);
  const [xbrlFile, setXbrlFile] = useState<File | null>(null);

  const [busy, setBusy] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (line: string) => setLog((ls) => [...ls, `• ${line}`]);

  const canCreate = name.trim().length > 0 && slug.trim().length > 0;

  const canNext = useMemo(() => {
    if (busy) return false;
    if (step === 1) return canCreate;
    if (step === 2) return !!tbFile;
    if (step === 3) return !!xbrlFile;
    return true;
  }, [busy, step, canCreate, tbFile, xbrlFile]);

  const nextLabel = useMemo(() => {
    switch (step) {
      case 1: return "Crea pratica";
      case 2: return "Carica TB";
      case 3: return "Carica XBRL";
      case 4: return "Ingest & Compute";
      default: return "Avanti";
    }
  }, [step]);

  const handleNext = async () => {
    if (!canNext) return;

    if (step === 1) {
      setBusy(true);
      try {
        await createCase({ slug, name, company_id: companyId });
        pushLog(`Creato/Verificato case con slug "${slug}"`);
        toast.success("Pratica creata/verificata");
        setStep(2);
      } catch (e: any) {
        const msg = String(e?.message || "");
        if (msg.toLowerCase().includes("slug already exists")) {
          pushLog(`Case già esistente: uso slug "${slug}"`);
          toast.success("Pratica già esistente: continuo");
          setStep(2);
        } else {
          pushLog(`Errore creazione case: ${msg}`);
          toast.error(`Errore creazione: ${msg}`);
        }
      } finally { setBusy(false); }
      return;
    }

    if (step === 2) {
      if (!tbFile) return;
      setBusy(true);
      try {
        await uploadTb(slug, tbFile);
        pushLog("Upload TB completato");
        toast.success("TB caricato");
        setStep(3);
      } catch (e: any) {
        const msg = String(e?.message || e);
        pushLog(`Errore upload TB: ${msg}`);
        toast.error(`Upload TB: ${msg}`);
      } finally { setBusy(false); }
      return;
    }

    if (step === 3) {
      if (!xbrlFile) return;
      setBusy(true);
      try {
        await uploadXbrl(slug, xbrlFile);
        pushLog("Upload XBRL completato");
        toast.success("XBRL caricato");
        setStep(4);
      } catch (e: any) {
        const msg = String(e?.message || e);
        pushLog(`Errore upload XBRL: ${msg}`);
        toast.error(`Upload XBRL: ${msg}`);
      } finally { setBusy(false); }
      return;
    }

    if (step === 4) {
      setBusy(true);
      try {
        await ingest(slug);
        pushLog("Snapshot creato (ingest)");
        toast.success("Snapshot creato");

        const res: ComputeResponse = await compute(slug);
        pushLog("Compute eseguito");
        toast.success("Compute ok");

        // salva tra i recenti e vai ai risultati
        addRecentCase(slug, name);
        navigate(`/results/${encodeURIComponent(slug)}`, { state: { compute: res } });
      } catch (e: any) {
        const msg = String(e?.message || e);
        pushLog(`Errore ingest/compute: ${msg}`);
        toast.error(`Ingest/compute: ${msg}`);
      } finally { setBusy(false); }
      return;
    }
  };

  const handleBack = () => { if (!busy && step > 1) setStep(step - 1); };

  return (
    <div className="space-y-6">
      {/* Header + progress */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="heading">Nuova pratica</h1>
          <p className="text-sm muted">Wizard a 4 step, collegato al backend</p>
        </div>
        <div className="h-2 w-64 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(step/4)*100}%` }} />
        </div>
      </div>

      {/* Step content */}
      <Card>
        <div className="space-y-4">
          <div className="text-sm uppercase tracking-wide text-slate-400">
            {step}. {steps[step - 1]}
          </div>

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-slate-300">Nome pratica</label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:border-brand-600"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    const auto = slugify(e.target.value);
                    if (!slug || slug === slugify(name)) setSlug(auto);
                  }}
                  placeholder="Es. debug 6"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Slug</label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono focus:outline-none focus:border-brand-600"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="debug-6"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Company ID</label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:border-brand-600"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <FileDrop
              accept=".csv,text/csv"
              label="Trascina qui il Trial Balance (CSV) oppure clicca"
              hint='Header: account_code,account_name,debit,credit'
              onFilesSelected={(files) => setTbFile(files?.[0] ?? null)}
            />
          )}

          {step === 3 && (
            <>
              <FileDrop
                accept=".xml,.xbrl,application/xml"
                label="Trascina qui il Bilancio XBRL (XML) oppure clicca"
                hint="Per l'MVP è sufficiente un XML ben formato (parser XBRL è stub)."
                onFilesSelected={(files) => setXbrlFile(files?.[0] ?? null)}
              />
              {xbrlFile && (
                <div className="text-sm mt-2">
                  Selezionato: <span className="font-mono">{xbrlFile.name}</span>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Pronto a creare lo snapshot (ingest) e calcolare KPI/distribuzioni.</p>
              <ul className="text-xs muted list-disc pl-5">
                <li>Ingest usa la coppia TB+XBRL più recenti</li>
                <li>Compute (MVP) calcola KPI e CNC/LG a partire dal TB</li>
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={handleBack} disabled={busy || step === 1} className="btn-ghost disabled:opacity-50">
          Indietro
        </button>
        <button type="button" onClick={handleNext} disabled={!canNext} className="btn-primary disabled:opacity-50">
          {busy ? "Attendere..." : nextLabel}
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <Card>
          <div className="text-sm font-medium mb-2">Log</div>
          <div className="text-xs text-slate-400 whitespace-pre-wrap">{log.join("\n")}</div>
        </Card>
      )}
    </div>
  );
}
