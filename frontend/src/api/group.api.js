import axios from "./axios";

export const groupAPI = {
  createGroup: (data) => axios.post("/groups", data),
  getMyGroups: () => axios.get("/groups"),
  getGroup: (id) => axios.get(`/groups/${id}`),
  updateGroup: (id, data) => axios.put(`/groups/${id}`, data),
  addMember: (groupId, data) => axios.post(`/groups/${groupId}/members`, data),
  removeMember: (groupId, userId, data) =>
    axios.delete(`/groups/${groupId}/members/${userId}`, { data }),
  getGroupMembers: (groupId) => axios.get(`/groups/${groupId}/members`),
};
