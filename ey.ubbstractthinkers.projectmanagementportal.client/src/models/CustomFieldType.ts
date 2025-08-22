export const Text: CustomFieldType = "Text";
export const Date: CustomFieldType = "Date";

export type CustomFieldType = "Text" | "Date";

const customFieldTypeMapping: { [key in CustomFieldType]: number } = {
  Text: 1,
  Date: 2,
};

const customFieldTypeNumberMapping: { [key: number]: CustomFieldType } = {
  1: "Text",
  2: "Date",
};

export const getCustomFieldTypeValue = (status: CustomFieldType) => {
  return customFieldTypeMapping[status];
};

export const getCustomFieldTypeFromValue = (value: number) => {
  return customFieldTypeNumberMapping[value];
};
