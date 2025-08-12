export interface Template {
  uid?: string;
  name: string;
  description: string;
  stageUids: string[];
}

export const DefaultTemplate: Template = {
  name: "",
  description: "",
  stageUids: [],
};
