import type { Dayjs } from "dayjs";
import type { TaskStatus } from "./TaskStatus";
import dayjs from "dayjs";
import { Default } from "./TaskStatus";

export interface ProjectTask {
  uid?: string;
  name: string;
  description: string;
  status: TaskStatus;
  startDate: Dayjs | string;
  endDate: Dayjs | string | null;
  projectUid: string;
  resourceId: string | null;
}

export const DefaultTask: ProjectTask = {
  name: "",
  description: "",
  status: Default,
  startDate: dayjs(),
  endDate: null,
  projectUid: "",
  resourceId: null,
};
