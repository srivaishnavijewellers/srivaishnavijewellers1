import api from "./api.js";

export const fetchSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const saveSettings = async (payload) => {
  const { data } = await api.put("/settings", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.post("/settings/change-password", payload);
  return data;
};

export const fetchSystemStatus = async () => {
  const { data } = await api.get("/settings/system-status");
  return data;
};

export const testPrinterRequest = async () => {
  const { data } = await api.post("/settings/test-printer");
  return data;
};

export const testLabelRequest = async () => {
  const { data } = await api.post("/settings/test-label");
  return data;
};
