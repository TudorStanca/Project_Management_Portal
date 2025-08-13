export const Pending: ApprovalStatus = "Pending";
export const Approved: ApprovalStatus = "Approved";
export const Rejected: ApprovalStatus = "Rejected";
export const Default: ApprovalStatus = "Default";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Default";

const approvalStatusMapping: { [key in ApprovalStatus]: number } = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Default: 0,
};

const approvalStatusNumberMapping: { [key: number]: ApprovalStatus } = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  0: "Default",
};

export const getApprovalStatusValue = (status: ApprovalStatus) => {
  return approvalStatusMapping[status];
};

export const getApprovalStatusFromValue = (value: number) => {
  return approvalStatusNumberMapping[value];
};
