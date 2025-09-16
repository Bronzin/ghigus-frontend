import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DistributionsTable from '../components/DistributionsTable';
import KpiCards from '../components/KpiCards';
import { Distribution, KPI } from '../types';

const Dashboard = () => {
  const kpis = useMemo<KPI[]>(
    () => [
      { id: 'revenue', label: 'Ricavi attesi', value: 2.8, unit: 'M€', change: 5.8, trend: 'up' },
      { id: 'margin', label: 'Margine lordo', value: 58.2, unit: '%', change: 1.2, trend: 'flat' },
      { id: 'cac', label: 'CAC', value: 315, unit: '€', change: -4.6, trend: 'down' },
      { id: 'ltv', label: 'LTV', value: 1820, unit: '€', change: 6.5, trend: 'up' }
    ],
    []
  );

  const distributions = useMemo<Distribution[]>(
    () => [
      { id: 'conv', metric: 'Tasso conversione', mean: 3.8, median: 3.6, stdDev: 0.7, p90: 5.2 },
      { id: 'tickets', metric: 'Ticket medio', mean: 129.5, median: 124.0, stdDev: 14.6, p90: 152.1 },
      { id: 'retention', metric: 'Retention 6 mesi', mean: 68.3, median: 68.0, stdDev: 3.1, p90: 72.5 }
    ],
    []
  );

  const forecastSeries = useMemo(
    () => [
      { month: 'Gen', base: 180, optimistic: 195, pessimistic: 165 },
      { month: 'Feb', base: 190, optimistic: 204, pessimistic: 173 },
      { month: 'Mar', base: 205, optimistic: 219, pessimistic: 186 },
      { month: 'Apr', base: 216, optimistic: 233, pessimistic: 195 },
      { month: 'Mag', base: 228, optimistic: 246, pessimistic: 205 },
      { month: 'Giu', base: 239, optimistic: 257, pessimistic: 213 }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400">Controlla lo stato delle simulazioni più recenti.</p>
        </div>
        <Link
          to="/cases/new"
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500"
        >
          + Nuovo scenario
        </Link>
      </div>

      <KpiCards kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Previsioni ricavi</h2>
              <span className="text-xs text-slate-500">base vs scenari</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastSeries} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="optimistic" stroke="#34d399" fill="none" strokeWidth={2} />
                  <Area type="monotone" dataKey="base" stroke="#38bdf8" fill="url(#colorBase)" strokeWidth={2} />
                  <Area type="monotone" dataKey="pessimistic" stroke="#f87171" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div>
          <DistributionsTable distributions={distributions} title="Distribuzioni chiave" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
