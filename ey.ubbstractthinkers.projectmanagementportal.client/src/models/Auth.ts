export interface User {
  id: string | null;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  photo: File | Blob | null;
}

export const DefaultUser: User = {
  id: null,
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  photo: new Blob(),
};
