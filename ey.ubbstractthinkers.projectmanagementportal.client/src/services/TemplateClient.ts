import type { Project } from "@models/Project";
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

export async function getTemplate(id: string): Promise<Template> {
  const response: AxiosResponse<Template> = await api.get("/" + id);

  return response.data;
}

export async function getProjectsWithTemplate(id: string): Promise<Project[]> {
  const response: AxiosResponse<Project[]> = await api.get(`/${id}/projects`);

  return response.data;
}

export async function saveTemplate(template: Template): Promise<void> {
  await api.post("", template);
}

export async function updateTemplate(
  id: string,
  template: Template,
): Promise<void> {
  await api.put("/" + id, template);
}
