import type { Dayjs } from "dayjs";

export interface Project {
  uid?: string;
  name: string;
  description: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string | null;
}
