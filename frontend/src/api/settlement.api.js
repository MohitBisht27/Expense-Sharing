import axios from "./axios";

export const settlementAPI = {
  createSettlement: (data) => axios.post("/settlements", data),
  getGroupSettlements: (groupId) => axios.get(`/settlements/group/${groupId}`),
  getGroupBalance: (groupId) =>
    axios.get(`/settlements/group/${groupId}/balance`),
  getUserBalanceDetails: (groupId, userId) =>
    axios.get(`/settlements/group/${groupId}/user/${userId}/details`),
  getSuggestedSettlements: (groupId) =>
    axios.get(`/settlements/group/${groupId}/suggest`),
};
