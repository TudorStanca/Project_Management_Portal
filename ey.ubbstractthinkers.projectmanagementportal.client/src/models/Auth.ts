export interface User {
  id: string | null;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

export const DefaultUser: User = {
  id: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  profileImage: null,
};
