import type { Stage } from "@models/Stage";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api/stages",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getStages(): Promise<Stage[]> {
  const response: AxiosResponse<Stage[]> = await api.get("");

  return response.data;
}
