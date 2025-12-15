import api from "./axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};


export const loadAlerts = async (userId) => {
  const res = await api.get(`/alerts/user/${userId}`);
  return res.data;
};

export const createAlert = async (data) => {
  const res = await api.post("/alerts", data);
  return res.data;
};

export const updateAlert = async (id, data) => {
  const res = await api.put(`/alerts/${id}`, data);
  return res.data;
};

export const deleteAlert = async (id) => {
  const res = await api.delete(`/alerts/${id}`);
  return res.data;
};
