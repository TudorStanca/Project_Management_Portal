export interface Stage {
  uid: string;
  name: string;
  description: string;
  orderNumber: number;
}

export const DefaultStage: Stage = {
  uid: "",
  name: "",
  description: "",
  orderNumber: 0,
};
