import api from "./api.js";

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const verifyOtpCode = async (payload) => {
  const { data } = await api.post("/auth/verify-otp", payload);
  return data;
};

export const resendOtpCode = async (payload) => {
  const { data } = await api.post("/auth/resend-otp", payload);
  return data;
};

export const forgotPasswordRequest = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

export const resetPasswordRequest = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logoutRequest = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

