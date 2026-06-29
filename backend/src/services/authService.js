import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sendOtpEmail } from "./emailService.js";
import { AppError } from "../utils/appError.js";
import { generateOtp } from "../utils/generateOtp.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_REQUEST_WINDOW_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;
const MAX_OTP_REQUESTS = 3;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000;

export const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status
});

const resetOtpState = (user) => {
  user.otp = null;
  user.otpExpiry = null;
  user.otpPurpose = null;
  user.otpAttempts = 0;
};

const ensureUserCanLogin = (user) => {
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("This user account is disabled.", 403);
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new AppError("Too many login attempts. Please try again later.", 429);
  }
};

const canSendNewOtp = (user) => {
  const now = Date.now();
  const lastSent = user.lastOtpSentAt ? user.lastOtpSentAt.getTime() : 0;

  if (now - lastSent > OTP_REQUEST_WINDOW_MS) {
    user.otpRequestCount = 0;
  }

  if (user.otpRequestCount >= MAX_OTP_REQUESTS) {
    throw new AppError("Too many OTP requests. Please wait a few minutes.", 429);
  }
};

export const issueOtpForUser = async (user, purpose) => {
  canSendNewOtp(user);

  user.otp = generateOtp();
  user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
  user.otpPurpose = purpose;
  user.otpAttempts = 0;
  user.otpRequestCount += 1;
  user.lastOtpSentAt = new Date();
  await user.save();

  await sendOtpEmail({ email: user.email, otp: user.otp, purpose });
};

export const verifyPassword = async (user, password) => {
  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOGIN_LOCK_MS);
      user.loginAttempts = 0;
    }

    await user.save();
    throw new AppError("Invalid email or password.", 401);
  }

  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();
};

export const verifyUserOtp = async ({ email, otp, purpose }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  ensureUserCanLogin(user);

  if (!user.otp || !user.otpExpiry || user.otpPurpose !== purpose) {
    throw new AppError("No active OTP found. Please request a new OTP.", 400);
  }

  if (user.otpExpiry.getTime() < Date.now()) {
    resetOtpState(user);
    await user.save();
    throw new AppError("OTP has expired. Please request a new OTP.", 400);
  }

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
    resetOtpState(user);
    await user.save();
    throw new AppError("Too many OTP attempts. Please request a new OTP.", 429);
  }

  if (user.otp !== otp) {
    user.otpAttempts += 1;
    await user.save();
    throw new AppError("The OTP you entered is incorrect.", 400);
  }

  resetOtpState(user);
  await user.save();
  return user;
};

export const getActiveUserByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  ensureUserCanLogin(user);
  return user;
};

export const updateUserPassword = async (user, password) => {
  user.password = await bcrypt.hash(password, 10);
  await user.save();
};

