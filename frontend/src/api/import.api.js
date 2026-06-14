import axios from "./axios";

export const importAPI = {
  importCSV: (groupId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`/import/group/${groupId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getImportLogs: (groupId) => axios.get(`/import/group/${groupId}/logs`),
  getImportLog: (id) => axios.get(`/import/logs/${id}`),
};
