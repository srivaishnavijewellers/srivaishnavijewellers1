export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

