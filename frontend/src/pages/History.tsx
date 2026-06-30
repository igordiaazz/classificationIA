import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHistory } from "../api";
import type { HistoryRecord, PaginationInfo } from "../types";

export default function History() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHistory(page)
      .then((res) => {
        setRecords(res.data);
        setPagination(res.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Histórico de Predições
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Nenhuma predição encontrada.
          <br />
          <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
            Classificar uma imagem
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">
                    Arquivo
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">
                    Classe
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">
                    Confiança
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">
                    Data
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500" />
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {record.filename}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {record.predictedClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {(record.confidence * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/history/${record.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">
                {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
