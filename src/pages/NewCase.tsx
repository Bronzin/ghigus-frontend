import { FormEvent, useMemo, useState } from 'react';
import AssumptionsForm from '../components/AssumptionsForm';
import FileDrop from '../components/FileDrop';
import { Assumption, WizardStep } from '../types';

const steps: WizardStep[] = [
  {
    id: 'upload',
    title: 'Dataset',
    description: 'Carica i dati necessari alla simulazione e definisci le informazioni base.'
  },
  {
    id: 'assumptions',
    title: 'Assunzioni',
    description: 'Personalizza i parametri che guideranno il modello previsivo.'
  },
  {
    id: 'review',
    title: 'Riepilogo',
    description: 'Controlla e conferma la configurazione del caso.'
  }
];

const NewCase = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseName, setCaseName] = useState('Scenario Q1 2025');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([
    {
      id: 'growth',
      label: 'Tasso di crescita mensile',
      value: 4.2,
      unit: '%',
      description: 'Incremento medio atteso basato sui dati storici.'
    },
    {
      id: 'churn',
      label: 'Churn clienti',
      value: 2.1,
      unit: '%',
      description: 'Tasso medio di abbandono mensile.'
    },
    {
      id: 'marketing',
      label: 'Budget marketing mensile',
      value: 48000,
      unit: '€',
      description: 'Budget totale destinato alle campagne paid.'
    }
  ]);

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  const handleNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Caso creato! (mock)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Nuovo caso</h1>
        <p className="text-sm text-slate-400">Wizard in tre step per configurare una nuova simulazione.</p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Step {currentStep + 1} di {steps.length}</p>
            <p className="text-xs text-slate-500">{steps[currentStep].title}</p>
          </div>
          <div className="h-2 flex-1 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{steps[currentStep].title}</h2>
          <p className="text-sm text-slate-400">{steps[currentStep].description}</p>
        </div>

        {currentStep === 0 && (
          <div className="space-y-5">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Nome caso</span>
              <input
                value={caseName}
                onChange={(event) => setCaseName(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">Dataset</span>
              <FileDrop onFilesSelected={setFiles} multiple={false} hint="CSV o XLSX fino a 20MB" />
              {files && files.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  Selezionato: <span className="font-semibold text-slate-200">{files[0].name}</span>
                </p>
              )}
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Note</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </label>
          </div>
        )}

        {currentStep === 1 && <AssumptionsForm assumptions={assumptions} onChange={setAssumptions} />}

        {currentStep === 2 && (
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Riepilogo generale</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <span className="text-slate-400">Nome caso:</span>{' '}
                  <span className="font-semibold text-slate-100">{caseName}</span>
                </li>
                <li>
                  <span className="text-slate-400">Dataset:</span>{' '}
                  <span className="font-semibold text-slate-100">{files?.[0]?.name ?? 'Non caricato'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Assunzioni</h3>
              <ul className="mt-2 space-y-1 text-slate-300">
                {assumptions.map((assumption) => (
                  <li key={assumption.id} className="flex justify-between gap-2 rounded-lg bg-slate-950/60 px-3 py-2">
                    <span>{assumption.label}</span>
                    <span className="font-semibold">
                      {assumption.value}
                      {assumption.unit && <span className="ml-1 text-xs text-slate-400">{assumption.unit}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {notes && (
              <div>
                <h3 className="text-base font-semibold text-slate-100">Note</h3>
                <p className="mt-2 whitespace-pre-line rounded-lg bg-slate-950/60 px-3 py-2 text-slate-300">{notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
        >
          Indietro
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500"
          >
            Avanti
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
          >
            Crea caso
          </button>
        )}
      </div>
    </form>
  );
};

export default NewCase;
