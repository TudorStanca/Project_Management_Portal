import type { CustomField } from "@models/CustomField";
import type { customFieldValue } from "@models/CustomFieldValue";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api/customfields",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCustomFields(): Promise<CustomField[]> {
  const response: AxiosResponse<CustomField[]> = await api.get("");

  return response.data;
}

export async function getCustomField(id: string): Promise<CustomField> {
  const response: AxiosResponse<CustomField> = await api.get("/" + id);

  return response.data;
}

export async function saveCustomField(customField: CustomField): Promise<void> {
  await api.post("", customField);
}

export async function deleteCustomField(uid: string): Promise<void> {
  await api.delete("/" + uid);
}

export async function getCustomFieldsByTemplateId(
  templateId: string,
): Promise<CustomField[]> {
  const response: AxiosResponse<CustomField[]> = await api.get(
    "/templates/" + templateId,
  );

  return response.data;
}

export async function getCustomFieldsByProjectId(
  projectId: string,
): Promise<CustomField[]> {
  const response: AxiosResponse<CustomField[]> = await api.get(
    "/projects/" + projectId,
  );

  return response.data;
}

export async function updateCustomFieldValue(
  projectId: string,
  customFieldValues: customFieldValue[],
): Promise<void> {
  await api.put("/projects/" + projectId, customFieldValues);
}
