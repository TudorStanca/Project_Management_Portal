import axios, { type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/api",
});

interface Project {
  Uid: string;
  Name: string;
  Description?: string;
  StartDate: Date;
  EndDate?: Date;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response: AxiosResponse<Project[]> = await api.get("/project");
    console.log(response.data);
    console.log(response.headers);
    return response.data;
  } catch (error) {
    //TO DO: Actually do error handling
    console.log(error);
    throw error;
  }
}
