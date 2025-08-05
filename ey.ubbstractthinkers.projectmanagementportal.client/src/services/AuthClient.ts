import axios, { type AxiosResponse } from "axios";
import type { User } from "../models/Auth";

const api = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function register(user: User) {
  await api.post("/register", user);
}

export async function login(user: User) {
  await api.post("/login", user);
}

export async function logout() {
  await api.post("/logout");
}

export async function getUser(): Promise<User> {
  const response: AxiosResponse<User> = await api.get("/pingauth");

  return response.data;
}
