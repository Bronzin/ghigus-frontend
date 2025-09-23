// src/lib/ghigusApi.ts
import type {
  KPI,
  ComputeResponse,
  UploadResponse,
  UploadRecord,
  CaseCreatePayload,
} from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL;

/** Fetch JSON helper (non forzare Content-Type quando usi FormData) */
async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const ghigusApi = {
  createCase(payload: CaseCreatePayload) {
    return jfetch<{ id: string; slug: string }>(`${BASE}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  uploadXbrl(caseId: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return jfetch<UploadResponse>(`${BASE}/cases/${caseId}/upload-xbrl`, {
      method: "POST",
      body: fd,
    });
  },

  uploadTb(caseId: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return jfetch<UploadResponse>(`${BASE}/cases/${caseId}/upload-tb`, {
      method: "POST",
      body: fd,
    });
  },

  ingest(caseId: string) {
    return jfetch<{ snapshot_id: string; xbrl_upload_id: number; tb_upload_id: number }>(
      `${BASE}/cases/${caseId}/ingest`,
      { method: "POST" }
    );
  },

  compute(caseId: string) {
    return jfetch<ComputeResponse>(`${BASE}/cases/${caseId}/compute`);
  },

  listUploads(caseId: string, includeSigned = false) {
    return jfetch<UploadRecord[]>(
      `${BASE}/cases/${caseId}/uploads?include_signed=${includeSigned ? "true" : "false"}`
    );
  },

  canonical(caseId: string) {
    return jfetch<any>(`${BASE}/cases/${caseId}/canonical`);
  },
};
