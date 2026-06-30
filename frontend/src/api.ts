import type { PredictResponse, HistoryResponse, HistoryRecordDetail } from "./types";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function predictImage(file: File): Promise<PredictResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<PredictResponse>("/predict", form);
  return data;
}

export async function fetchHistory(
  page = 1,
  limit = 20
): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>(
    `/history?page=${page}&limit=${limit}`
  );
  return data;
}

export async function fetchHistoryDetail(
  id: string
): Promise<HistoryRecordDetail> {
  const { data } = await api.get<HistoryRecordDetail>(`/history/${id}`);
  return data;
}

export async function deleteHistory(id: string): Promise<void> {
  await api.delete(`/history/${id}`);
}
