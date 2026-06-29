import api from "./api.js";

export const getDashboardSummary = async () => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};

export const getRecentStock = async () => {
  const { data } = await api.get("/dashboard/recent-stock");
  return data;
};

export const getSystemStatus = async () => {
  const { data } = await api.get("/dashboard/system-status");
  return data;
};

