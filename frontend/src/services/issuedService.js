import api from "./api.js";

export const getIssuedStocks = async (params = {}) => {
  const { data } = await api.get("/stocks/issued", { params });
  return data;
};
