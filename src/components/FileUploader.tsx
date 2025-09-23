import React, { useRef } from "react";

interface FileUploaderProps {
  label: string;
  accept: string;
  onFileSelected: (file: File) => void;
  file?: File | null;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept,
  onFileSelected,
  file,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="border-2 border-dashed rounded-2xl p-6 text-center">
      <p className="mb-2 font-medium">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelected(f);
        }}
        disabled={disabled}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Scegli file
      </button>

      {file && (
        <div className="mt-3 text-sm text-gray-600">
          Selezionato: <span className="font-mono">{file.name}</span>
        </div>
      )}
    </div>
  );
};
