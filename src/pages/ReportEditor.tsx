import { useMemo, useState } from 'react';
import { KPI } from '../types';
import KpiCards from '../components/KpiCards';

const ReportEditor = () => {
  const [title, setTitle] = useState('Report scenario base');
  const [author, setAuthor] = useState('Team Strategy');
  const [content, setContent] = useState(
    '## Sintesi esecutiva\n\nIl nuovo scenario mostra un incremento dei ricavi trainato da una migliore conversione e da un LTV più alto.'
  );

  const previewKpis = useMemo<KPI[]>(
    () => [
      { id: 'revenues', label: 'Ricavi', value: 2.9, unit: 'M€', change: 6.4, trend: 'up' },
      { id: 'gross-margin', label: 'Margine lordo', value: 59.1, unit: '%', change: 1.6, trend: 'up' },
      { id: 'ebitda', label: 'EBITDA', value: 1.1, unit: 'M€', change: 4.1, trend: 'up' }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Report editor</h1>
        <p className="text-sm text-slate-400">Prepara un report condivisibile sulle simulazioni selezionate.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-100">Metadati</h2>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Titolo</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Autore</span>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Contenuto (Markdown)</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </label>
          <button className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500">
            Esporta PDF
          </button>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Anteprima</h2>
            <p className="text-xs text-slate-500">Il contenuto viene mostrato in anteprima per una revisione rapida.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">Titolo</span>
              <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
              <span className="text-xs text-slate-500">Preparato da {author}</span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              {content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <span className="text-xs uppercase tracking-wide text-slate-500">KPI sintetici</span>
              <KpiCards kpis={previewKpis} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;
