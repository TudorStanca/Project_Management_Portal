import axios, { type AxiosResponse } from "axios";
import type { Project } from "@models/Project";

const api = axios.create({
  baseURL: "/api/projects",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getProjects(): Promise<Project[]> {
  const response: AxiosResponse<Project[]> = await api.get("");

  return response.data;
}

export async function getProjectsForUser(userId: string): Promise<Project[]> {
  const response: AxiosResponse<Project[]> = await api.get("/users/" + userId);

  return response.data;
}

export async function getProject(uid: string): Promise<Project> {
  const response: AxiosResponse<Project> = await api.get("/" + uid);

  return response.data;
}

export async function saveProject(project: Project): Promise<void> {
  await api.post("", project);
}

export async function updateProject(project: Project): Promise<void> {
  await api.put("/" + project.uid, project);
}

export async function deleteProject(uid: string): Promise<void> {
  await api.delete("/" + uid);
}

export async function addStakeholders(uid: string, stakeholderIds: string[]) {
  await api.post("/" + uid + "/stakeholders", stakeholderIds);
}

export async function deleteStakeholders(
  uid: string,
  stakeholderIds: string[],
) {
  await api.delete("/" + uid + "/stakeholders", {
    data: stakeholderIds,
  });
}

export async function addResources(uid: string, resourceIds: string[]) {
  await api.post("/" + uid + "/resources", resourceIds);
}

export async function deleteResources(uid: string, resourceIds: string[]) {
  await api.delete("/" + uid + "/resources", {
    data: resourceIds,
  });
}
