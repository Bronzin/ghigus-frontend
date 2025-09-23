import type { CncLgItem, Distribution } from "../types";

export function mapToDistribution(items: CncLgItem[], metric = "amount"): Distribution[] {
  return items.map((it, i) => ({
    id: String(i),
    metric,
    mean: it.amount,
    median: it.amount,
    stdDev: 0,
    p90: it.amount,
  }));
}
