export interface PredictResponse {
  id: string;
  classe: string;
  confianca: number;
  filename: string;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  filename: string;
  predictedClass: string;
  confidence: number;
  createdAt: string;
}

export interface HistoryRecordDetail extends HistoryRecord {
  imageData: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HistoryResponse {
  data: HistoryRecord[];
  pagination: PaginationInfo;
}
