import axios, { type AxiosResponse } from "axios";
import type { Project } from "../models/Project";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getProjects(): Promise<Project[]> {
  const response: AxiosResponse<Project[]> = await api.get("/project");

  return response.data;
}

export async function getProject(uid: string): Promise<Project> {
  const response: AxiosResponse<Project> = await api.get("/project/" + uid);

  return response.data;
}

export async function saveProject(project: Project): Promise<void> {
  await api.post("/project", project);
}

export async function updateProject(project: Project): Promise<void> {
  await api.put("/project" + project.uid, project);
}

export async function deleteProject(uid: string): Promise<void> {
  await api.delete("/project" + uid);
}
