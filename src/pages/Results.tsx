import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DistributionsTable from '../components/DistributionsTable';
import { Distribution } from '../types';

const Results = () => {
  const sensitivity = useMemo(
    () => [
      { driver: 'Prezzo', base: 100, optimistico: 118, pessimistico: 82 },
      { driver: 'Marketing', base: 100, optimistico: 112, pessimistico: 87 },
      { driver: 'Churn', base: 100, optimistico: 109, pessimistico: 91 },
      { driver: 'Sales', base: 100, optimistico: 121, pessimistico: 79 }
    ],
    []
  );

  const distributions = useMemo<Distribution[]>(
    () => [
      { id: 'net-income', metric: 'Utile netto', mean: 890000, median: 874000, stdDev: 92000, p90: 1010000 },
      { id: 'cash', metric: 'Cassa finale', mean: 420000, median: 415000, stdDev: 61000, p90: 498000 },
      { id: 'ebitda', metric: 'EBITDA', mean: 640000, median: 636000, stdDev: 54000, p90: 712000 }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Risultati</h1>
          <p className="text-sm text-slate-400">Analizza l’output delle simulazioni ed esporta i dati principali.</p>
        </div>
        <button className="inline-flex items-center rounded-full border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-200 transition hover:bg-brand-600/10">
          Scarica CSV
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between text-sm">
              <h2 className="text-lg font-semibold text-slate-100">Analisi sensitività</h2>
              <span className="text-xs text-slate-500">Indice 100 = scenario base</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensitivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="driver" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="optimistico" fill="#34d399" radius={6} />
                  <Bar dataKey="base" fill="#38bdf8" radius={6} />
                  <Bar dataKey="pessimistico" fill="#f87171" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div>
          <DistributionsTable title="Distribuzioni output" distributions={distributions} />
        </div>
      </div>
    </div>
  );
};

export default Results;
