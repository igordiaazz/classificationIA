import { useCallback, useState } from "react";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  onFileSelect,
  disabled,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-gray-300 hover:border-gray-400"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg shadow-md"
          />
          <button
            onClick={() => {
              setPreview(null);
              onFileSelect(null as unknown as File);
            }}
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Remover imagem
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-4xl text-gray-300">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-gray-500">
            <span className="font-medium text-indigo-600 cursor-pointer">
              Clique para selecionar
            </span>{" "}
            ou arraste uma imagem aqui
          </div>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
    </div>
  );
}
