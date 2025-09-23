export type Trend = 'up' | 'down' | 'flat';

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change?: number;
  trend?: Trend;
}

export interface Distribution {
  id: string;
  metric: string;
  mean: number;
  median: number;
  stdDev: number;
  p90?: number;
}

export interface Assumption {
  id: string;
  label: string;
  value: number;
  unit?: string;
  description?: string;
}

export interface CaseFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface Case {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed';
  createdAt: string;
  updatedAt?: string;
  kpis: KPI[];
  distributions: Distribution[];
  assumptions: Assumption[];
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export interface CncLgItem {
  label: string;     // es. "Privilegiati"
  percent: number;   // 0..1
  amount: number;    // valore monetario calcolato
}

export interface ComputeResponse {
  kpis: KPI[];       // riutilizziamo il tuo KPI
  cnc: CncLgItem[];
  lg: CncLgItem[];
}

// Record di upload ritornati da /cases/{caseId}/uploads
export interface UploadRecord {
  upload_id: number;
  original_name: string;
  mime: string;
  size: number;
  created_at: string; // ISO
  path: string;
  signed_url?: string;
}

// Risposta di upload (XBRL/TB)
export interface UploadResponse {
  upload_id: number;
  path: string;
}

// Payload per creare la case
export interface CaseCreatePayload {
  slug: string;
  name: string;
  company_id: string; // nel tuo DB è varchar
}

// === Tipi per le API del backend ===
export interface CncLgItem {
  label: string;
  percent: number; // 0..1
  amount: number;
}

export interface ComputeResponse {
  kpis: KPI[];      // riuso del tuo KPI
  cnc: CncLgItem[];
  lg: CncLgItem[];
}

export interface UploadRecord {
  upload_id: number;
  original_name: string;
  mime: string;
  size: number;
  created_at: string;
  path: string;
  signed_url?: string;
}

export interface UploadResponse {
  upload_id: number;
  path: string;
}

export interface CaseCreatePayload {
  slug: string;
  name: string;
  company_id: string;
}
