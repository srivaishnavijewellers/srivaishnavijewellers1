const SESSION_KEY = "svj_stock_session";
const OTP_KEY = "svj_stock_otp_context";
const RESET_KEY = "svj_stock_reset_context";

const parseExpiryToMs = (expiresIn) => {
  if (typeof expiresIn === "number") {
    return expiresIn * 1000;
  }

  if (typeof expiresIn !== "string") {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const match = expiresIn.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unitMap = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return value * unitMap[match[2].toLowerCase()];
};

const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

export const saveSession = ({ token, expiresIn, user, rememberMe }) => {
  const expiresAt = Date.now() + parseExpiryToMs(expiresIn);
  const storage = getStorage(rememberMe);

  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  storage.setItem(
    SESSION_KEY,
    JSON.stringify({ token, expiresIn, expiresAt, user, rememberMe })
  );
};

export const getStoredSession = () => {
  const raw =
    localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

export const isSessionExpired = (session) =>
  !session?.expiresAt || session.expiresAt <= Date.now();

export const saveOtpContext = (value) =>
  localStorage.setItem(OTP_KEY, JSON.stringify(value));

export const getOtpContext = () => {
  const raw = localStorage.getItem(OTP_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearOtpContext = () => localStorage.removeItem(OTP_KEY);

export const saveResetContext = (value) =>
  localStorage.setItem(RESET_KEY, JSON.stringify(value));

export const getResetContext = () => {
  const raw = localStorage.getItem(RESET_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearResetContext = () => localStorage.removeItem(RESET_KEY);
