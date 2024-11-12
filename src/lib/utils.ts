import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { apiResponse, IJoinNewsLetterFrom } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const appConfig = {
  name: "Store Build",
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API + "/api/v1",
});

export const errorMessageAndStatus = (error: any) => {
  const message = error?.response?.data?.message;
  const status = error?.response?.data?.status?.toUpperCase();
  const data = error?.response?.data?.data;

  return { message, status, data };
};

export class StoreBuild {
  async joinNewsLetter(email: string, joinFrom: IJoinNewsLetterFrom) {
    const res: { data: apiResponse } = await api.post("/join-newsletter", {
      email,
      joinFrom,
    });
    return res.data;
  }
}

export const storeBuilder = new StoreBuild();
