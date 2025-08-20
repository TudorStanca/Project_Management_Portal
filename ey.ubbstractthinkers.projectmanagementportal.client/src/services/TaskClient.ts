import type { ProjectTask } from "@models/ProjectTask";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api/tasks",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function saveTask(task: ProjectTask): Promise<ProjectTask> {
  const response: AxiosResponse<ProjectTask> = await api.post("", task);

  return response.data;
}

export async function updateTask(task: ProjectTask): Promise<void> {
  await api.put("/" + task.uid, task);
}

export async function deleteTask(uid: string): Promise<void> {
  await api.delete("/" + uid);
}
