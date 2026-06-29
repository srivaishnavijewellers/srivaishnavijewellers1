import api from "./api.js";

export const getStocks = async (params = {}) => {
  const { data } = await api.get("/stocks", { params });
  return data;
};

export const generateItemNumber = async () => {
  const { data } = await api.get("/stocks/generate-item-number");
  return data;
};

export const generateBarcode = async (payload) => {
  const { data } = await api.post("/stocks/generate-barcode", payload);
  return data;
};

export const printLabelRequest = async (payload) => {
  const { data } = await api.post("/stocks/print-label", payload);
  return data;
};

export const createStock = async (payload) => {
  const { data } = await api.post("/stocks", payload);
  return data;
};

export const getStockById = async (id) => {
  const { data } = await api.get(`/stocks/${id}`);
  return data;
};

export const updateStock = async (id, payload) => {
  const { data } = await api.put(`/stocks/${id}`, payload);
  return data;
};

export const deleteStock = async (id) => {
  const { data } = await api.delete(`/stocks/${id}`);
  return data;
};
