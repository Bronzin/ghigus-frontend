// src/lib/apiWizard.ts
// Client leggero per le azioni della “procedura guidata” (wizard):
// - create case, upload TB/XBRL, ingest, compute, process
// - letture minime per dashboard (riclass/KPI) e gestione casi

// =====================================================
// Base URL (compatibile Vite)
// Legge VITE_API_BASE o VITE_API_BASE_URL, con fallback a 127.0.0.1
// =====================================================
function getApiBase(): string {
  const envBase =
    (import.meta as any).env?.VITE_API_BASE ??
    (import.meta as any).env?.VITE_API_BASE_URL ??
    "http://127.0.0.1:8000";
  return String(envBase).replace(/\/$/, "");
}

// =====================================================
// Helper HTTP
// =====================================================
type FetchInit = Omit<RequestInit, "body"> & {
  json?: any;
  form?: FormData;
  token?: string;
};

async function http<T = unknown>(path: string, init: FetchInit = {}): Promise<T> {
  const url = `${getApiBase()}${path}`;
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  if (init.json !== undefined) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  } else if (init.form) {
    body = init.form; // non settare Content-Type: pensa il browser (boundary)
  }

  if (init.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const res = await fetch(url, { ...init, headers, body });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} @ ${path} — ${txt}`);
  }

  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    return (await res.json()) as T;
  }
  // alcune API potrebbero tornare vuoto o text
  try {
    return (await res.json()) as T;
  } catch {
    // @ts-expect-error: T può essere void
    return undefined;
  }
}

function fd(entries: Record<string, any>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    if (v === undefined || v === null) continue;
    f.append(k, v as any);
  }
  return f;
}

// =====================================================
// Tipi minimi
// =====================================================
export type CaseLite = { slug: string; name?: string | null; created_at?: string };
export type RiclassRow = { riclass_code: string; riclass_desc?: string | null; amount: number };
export type KpiStd = { code: string; description?: string | null; value: number | string | null };

// =====================================================
// Cases
// =====================================================
export async function createCase(payload: { slug: string; name?: string | null }, token?: string) {
  return http<CaseLite>("/cases", { method: "POST", json: payload, token });
}

export async function listCases(token?: string) {
  return http<CaseLite[]>("/cases", { token });
}

export async function deleteCase(slug: string, token?: string) {
  await http<void>(`/cases/${encodeURIComponent(slug)}`, { method: "DELETE", token });
}

// =====================================================
// Uploads
// =====================================================
export async function uploadTB(slug: string, file: File | Blob, filename?: string, token?: string) {
  const name = filename || (file instanceof File ? file.name : "tb.csv");
  const form = fd({ file: new File([file], name) });
  return http<any>(`/cases/${encodeURIComponent(slug)}/upload-tb`, { method: "POST", form, token });
}

export async function uploadXBRL(slug: string, file: File | Blob, filename?: string, token?: string) {
  const name = filename || (file instanceof File ? file.name : "bilancio.xhtml");
  const form = fd({ file: new File([file], name) });
  return http<any>(`/cases/${encodeURIComponent(slug)}/upload-xbrl`, { method: "POST", form, token });
}

// (se nel backend esiste anche upload-bc)
export async function uploadBC(slug: string, file: File | Blob, filename?: string, token?: string) {
  const name = filename || (file instanceof File ? file.name : "bc.csv");
  const form = fd({ file: new File([file], name) });
  return http<any>(`/cases/${encodeURIComponent(slug)}/upload-bc`, { method: "POST", form, token });
}

// =====================================================
// Pipeline: ingest / compute / process
//   ✅ tutte in POST per evitare 405
// =====================================================
export async function ingest(slug: string) {
  return http<any>(`/cases/${encodeURIComponent(slug)}/ingest`, { method: "POST" });
}

export async function compute(slug: string) {
  return http<any>(`/cases/${encodeURIComponent(slug)}/compute`, { method: "POST" });
}

export async function process(slug: string) {
  return http<any>(`/cases/${encodeURIComponent(slug)}/process`, { method: "POST" });
}

// alias comodi se altrove usavi questi nomi
export const computeCase = compute;
export const processCase = process;

// =====================================================
// Letture dati per dashboard
// =====================================================
export async function getSpRiclass(slug: string) {
  return http<RiclassRow[]>(`/cases/${encodeURIComponent(slug)}/sp-riclass`);
}
export async function getCeRiclass(slug: string) {
  return http<RiclassRow[]>(`/cases/${encodeURIComponent(slug)}/ce-riclass`);
}
export async function getKpiStandard(slug: string) {
  return http<KpiStd[]>(`/cases/${encodeURIComponent(slug)}/kpi-standard`);
}
