import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHistoryDetail, deleteHistory } from "../api";
import type { HistoryRecordDetail } from "../types";
import ResultCard from "../components/ResultCard";

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<HistoryRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchHistoryDetail(id)
      .then(setRecord)
      .catch(() => setError("Registro não encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm("Remover este registro?")) return;
    setDeleting(true);
    try {
      await deleteHistory(id);
      navigate("/history");
    } catch {
      setError("Erro ao remover.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="text-center py-12 text-red-500">
        {error || "Registro não encontrado."}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button
        onClick={() => navigate("/history")}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        &larr; Voltar
      </button>

      {record.imageData && (
        <img
          src={record.imageData}
          alt={record.filename}
          className="w-full rounded-xl shadow-md max-h-80 object-contain bg-gray-100"
        />
      )}

      <div className="text-sm text-gray-500">
        Arquivo: <span className="font-medium text-gray-700">{record.filename}</span>
      </div>

      <ResultCard
        classe={record.predictedClass}
        confianca={record.confidence}
      />

      <div className="text-xs text-gray-400">
        Classificado em{" "}
        {new Date(record.createdAt).toLocaleString("pt-BR")}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-full py-2 px-4 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors text-sm"
      >
        {deleting ? "Removendo..." : "Remover do histórico"}
      </button>
    </div>
  );
}
