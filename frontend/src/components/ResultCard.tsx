interface ResultCardProps {
  classe: string;
  confianca: number;
}

export default function ResultCard({ classe, confianca }: ResultCardProps) {
  const percentage = (confianca * 100).toFixed(2);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Resultado</h3>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-indigo-600">{classe}</span>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Confiança</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
