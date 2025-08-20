import type { Dayjs } from "dayjs";
import dayjs, { isDayjs } from "dayjs";

export const formatDayjsToString = (isoDate: string | Dayjs): string => {
  let date: Date;

  if (dayjs.isDayjs(isoDate)) {
    date = isoDate.toDate();
  } else {
    date = new Date(isoDate);
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateToString = (isoDate: Date | null): string => {
  if (isoDate == null) {
    return "";
  }

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDayjsToJsonString = (date: Dayjs | string): string => {
  if (isDayjs(date)) {
    return date.format("YYYY-MM-DD");
  }

  return date;
};
