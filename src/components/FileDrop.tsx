import { type ChangeEvent, type DragEvent, useCallback, useState } from 'react';

interface FileDropProps {
  onFilesSelected: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
}

const FileDrop = ({ onFilesSelected, accept, multiple = false, label = 'Carica file', hint }: FileDropProps) => {
  const [isDragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragOver(false);
      onFilesSelected(event.dataTransfer.files);
    },
    [onFilesSelected]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onFilesSelected(event.target.files);
    },
    [onFilesSelected]
  );

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver ? 'border-brand-500 bg-brand-600/10 text-brand-100' : 'border-slate-700 bg-slate-900/60 text-slate-300'
      }`}
    >
      <span className="text-lg font-semibold">{label}</span>
      <span className="text-xs text-slate-400">Trascina e rilascia oppure clicca per selezionare</span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
      <input type="file" className="hidden" onChange={handleChange} accept={accept} multiple={multiple} />
    </label>
  );
};

export default FileDrop;
