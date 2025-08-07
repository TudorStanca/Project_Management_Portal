export interface User {
  id: string | null;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  photo: File | Blob | null;
}
