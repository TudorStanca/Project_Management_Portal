import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface Project {
  uid?: string;
  name: string;
  description: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string | null;
  ownerId: string | null;
  stakeholderIds: string[];
  resourceIds: string[];
  templateUid: string;
  currentStageUid?: string;
}

export const DefaultProject: Project = {
  name: "",
  description: "",
  startDate: dayjs(),
  endDate: null,
  ownerId: null,
  stakeholderIds: [],
  resourceIds: [],
  templateUid: "",
};
