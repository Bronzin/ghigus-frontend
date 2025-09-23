import React, { useRef, useState } from "react";

export default function FileDrop({
  accept,
  label,
  hint,
  onFilesSelected,
}: {
  accept?: string;
  label?: string;
  hint?: string;
  onFilesSelected: (files: FileList | null) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
        hover ? "border-brand-600 bg-slate-900/50" : "border-slate-700"
      }`}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault(); setHover(false);
        onFilesSelected(e.dataTransfer.files);
      }}
    >
      <p className="mb-3 font-medium text-slate-200">
        {label ?? "Trascina qui il file oppure clicca"}
      </p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="btn-primary"
      >
        Scegli file
      </button>
      {hint && <p className="mt-3 text-sm muted">{hint}</p>}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />
    </div>
  );
}
