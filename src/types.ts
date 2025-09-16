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
