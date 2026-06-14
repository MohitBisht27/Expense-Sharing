import axios from "./axios";

export const authAPI = {
  register: (data) => axios.post("/auth/register", data),
  login: (data) => axios.post("/auth/login", data),
  getMe: () => axios.get("/auth/me"),
  searchUsers: (query) => axios.get(`/auth/search?q=${query}`),
};
