import { Distribution } from '../types';

interface DistributionsTableProps {
  distributions: Distribution[];
  title?: string;
}

const DistributionsTable = ({ distributions, title }: DistributionsTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
    {title && <div className="border-b border-slate-800 px-5 py-4 text-sm font-semibold text-slate-200">{title}</div>}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th scope="col" className="px-5 py-3 text-left">
              Variabile
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Media
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Mediana
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Deviazione std
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              P90
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {distributions.map((distribution) => (
            <tr key={distribution.id} className="hover:bg-slate-900/70">
              <td className="px-5 py-3 text-left font-medium text-slate-200">{distribution.metric}</td>
              <td className="px-5 py-3 text-right text-slate-300">{distribution.mean.toFixed(2)}</td>
              <td className="px-5 py-3 text-right text-slate-300">{distribution.median.toFixed(2)}</td>
              <td className="px-5 py-3 text-right text-slate-300">{distribution.stdDev.toFixed(2)}</td>
              <td className="px-5 py-3 text-right text-slate-300">{distribution.p90?.toFixed(2) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DistributionsTable;
