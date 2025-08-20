export const NotStarted: TaskStatus = 1;
export const InProgress: TaskStatus = 2;
export const Done: TaskStatus = 3;
export const Blocked: TaskStatus = 4;
export const Default: TaskStatus = 0;

export type TaskStatus = 1 | 2 | 3 | 4 | 0;

const taskStatusMapping: { [key in TaskStatus]: string } = {
  [NotStarted]: "NotStarted",
  [InProgress]: "InProgress",
  [Done]: "Done",
  [Blocked]: "Blocked",
  [Default]: "Default",
};

const TaskStatusNumberMapping: { [key: string]: TaskStatus } = {
  NotStarted: NotStarted,
  InProgress: InProgress,
  Done: Done,
  Blocked: Blocked,
  Default: Default,
};

export const getTaskStatusValue = (status: TaskStatus) => {
  return taskStatusMapping[status];
};

export const getTaskStatusFromValue = (value: number) => {
  return TaskStatusNumberMapping[value];
};
