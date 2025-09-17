import axios from "axios";

const BASE_URL = "https://campus-management-backend-worf.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});