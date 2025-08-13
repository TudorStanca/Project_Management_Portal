import type { ApprovalRequest } from "@models/ApprovalRequest";
import {
  getApprovalStatusValue,
  type ApprovalStatus,
} from "@models/ApprovalStatus";
import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api/approvals",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function updateApprovalRequests(
  uid: string,
  status: ApprovalStatus,
) {
  await api.put("/" + uid, { status: getApprovalStatusValue(status) });
}

export async function getApprovalRequestsForUser(uid: string) {
  const response: AxiosResponse<ApprovalRequest[]> = await api.get(
    "/users/" + uid,
  );

  return response.data;
}
