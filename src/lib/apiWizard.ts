// src/lib/apiWizard.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export type Trend = "up" | "down" | "flat";

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: Trend;
}

export interface DistributionItem {
  label: string;
  percent: number; // 0..1
  amount: number;
}

export interface ComputeResponse {
  kpis: KPI[];
  cnc: DistributionItem[];
  lg: DistributionItem[];
}

export interface CaseMeta {
  id: string;
  slug: string;
  name: string;
  company_id: string;
  description?: string;
}

export async function createCase(input: {
  slug: string;
  name: string;
  company_id: string;
  description?: string;
}): Promise<CaseMeta> {
  const res = await fetch(`${API_BASE}/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  return handle<CaseMeta>(res);
}

export async function uploadTb(caseIdOrSlug: string, file: File): Promise<any> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseIdOrSlug)}/upload-tb`, {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" },
  });
  return handle<any>(res);
}


export async function uploadXbrl(caseIdOrSlug: string, file: File): Promise<any> {
  // Forza il content-type a application/xml per evitare il 400 del backend
  const xFile =
    file.type && file.type.includes("xml")
      ? file
      : new File([file], file.name, { type: "application/xml" });

  const fd = new FormData();
  // passiamo anche il filename così com'è
  fd.append("file", xFile, xFile.name);

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/cases/${encodeURIComponent(
      caseIdOrSlug
    )}/upload-xbrl`,
    {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}


export async function ingest(caseIdOrSlug: string): Promise<{
  snapshot_id: string;
  xbrl_upload_id: number;
  tb_upload_id: number;
}> {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseIdOrSlug)}/ingest`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  return handle(res);
}

export async function compute(caseIdOrSlug: string): Promise<ComputeResponse> {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseIdOrSlug)}/compute`, {
    headers: { Accept: "application/json" },
  });
  return handle<ComputeResponse>(res);
}

export async function listUploads(caseIdOrSlug: string): Promise<any[]> {
  const res = await fetch(
    `${API_BASE}/cases/${encodeURIComponent(caseIdOrSlug)}/uploads?include_signed=false`,
    { headers: { Accept: "application/json" } }
  );
  return handle<any[]>(res);
}
