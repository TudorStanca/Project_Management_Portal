export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  photo?: File | Blob;
}
