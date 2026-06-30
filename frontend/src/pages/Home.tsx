import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import ResultCard from "../components/ResultCard";
import { predictImage } from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    classe: string;
    confianca: number;
    id: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictImage(file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao classificar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Classificação de Imagens
        </h1>
        <p className="text-gray-500 mt-1">
          Faça upload de uma imagem para classificar com IA
        </p>
      </div>

      <ImageUploader
        onFileSelect={(f) => {
          setFile(f);
          setResult(null);
          setError(null);
        }}
        disabled={loading}
      />

      {file && !result && (
        <button
          onClick={handleClassify}
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Classificando..." : "Classificar Imagem"}
        </button>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <ResultCard classe={result.classe} confianca={result.confianca} />
          <button
            onClick={() => navigate(`/history/${result.id}`)}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Ver detalhes
          </button>
        </div>
      )}
    </div>
  );
}
