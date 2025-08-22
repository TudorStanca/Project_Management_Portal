import type { CustomFieldType } from "./CustomFieldType";
import type { CustomFieldValue } from "./CustomFieldValue";

export interface CustomField {
  uid?: string;
  name: string;
  description: string;
  type: CustomFieldType | number;
  templateId: string;
  visibleOnStageIds: string[];
  customFieldValue: CustomFieldValue | null;
}
