import axios from "axios";

const baseURL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://localhost:8080"
    : "/api";

export const network = axios.create({
  baseURL,
  withCredentials: true,
});
