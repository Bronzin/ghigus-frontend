import { Assumption } from '../types';

interface AssumptionsFormProps {
  assumptions: Assumption[];
  onChange: (assumptions: Assumption[]) => void;
}

const AssumptionsForm = ({ assumptions, onChange }: AssumptionsFormProps) => {
  const handleChange = (id: string, key: keyof Assumption, value: string) => {
    onChange(
      assumptions.map((assumption) =>
        assumption.id === id
          ? {
              ...assumption,
              [key]: key === 'value' ? Number(value) : value
            }
          : assumption
      )
    );
  };

  return (
    <div className="space-y-4">
      {assumptions.map((assumption) => (
        <div key={assumption.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex-1 text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Parametro</span>
              <input
                value={assumption.label}
                onChange={(event) => handleChange(assumption.id, 'label', event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="w-full text-sm sm:w-32">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Valore</span>
              <input
                type="number"
                value={assumption.value}
                onChange={(event) => handleChange(assumption.id, 'value', event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Descrizione</span>
            <textarea
              value={assumption.description ?? ''}
              onChange={(event) => handleChange(assumption.id, 'description', event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default AssumptionsForm;
