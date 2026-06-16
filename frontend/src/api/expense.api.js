import axios from "./axios";

export const expenseAPI = {
  createExpense: (data) => axios.post("/expenses", data),
  getGroupExpenses: (groupId, params) =>
    axios.get(`/expenses/group/${groupId}`, { params }),
  getExpense: (id) => axios.get(`/expenses/${id}`),
  updateExpense: (id, data) => axios.put(`/expenses/${id}`, data),
  deleteExpense: (id) => axios.delete(`/expenses/${id}`),
  getCategories: (groupId) =>
    axios.get(`/expenses/group/${groupId}/categories`),
  exportGroupExpenses: (groupId) =>
    axios.get(`/expenses/group/${groupId}/export`, { responseType: "blob" }),
};
