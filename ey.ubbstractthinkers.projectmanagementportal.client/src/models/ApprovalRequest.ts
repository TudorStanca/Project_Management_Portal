import type { ApprovalStatus } from "./ApprovalStatus";

export interface ApprovalRequest {
  uid: string;
  projectName: string;
  stageFromName: string;
  stageToName: string;
  status: ApprovalStatus;
  createdAt: Date | null;
  modifiedAt: Date | null;
  modifiedByUserEmail: string;
  createdByUserEmail: string;
}

export const DefaultApprovalRequest: ApprovalRequest = {
  uid: "",
  projectName: "",
  stageFromName: "",
  stageToName: "",
  status: "Default",
  createdAt: null,
  modifiedAt: null,
  modifiedByUserEmail: "",
  createdByUserEmail: "",
};
