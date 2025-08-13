import type { Template } from "@models/Template";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api/templates",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTemplates(): Promise<Template[]> {
  const response: AxiosResponse<Template[]> = await api.get("");

  return response.data;
}

export async function saveTemplate(template: Template): Promise<void> {
  await api.post("", template);
}
