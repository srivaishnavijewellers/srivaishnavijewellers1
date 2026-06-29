import { AppError } from "./appError.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  if (!emailRegex.test(email)) {
    throw new AppError("Please enter a valid email address.", 400);
  }
};

export const validatePassword = (password) => {
  if (!password) {
    throw new AppError("Password is required.", 400);
  }

  if (password.length < 6 || password.length > 30) {
    throw new AppError("Password must be between 6 and 30 characters.", 400);
  }
};

export const validateOtp = (otp) => {
  if (!otp) {
    throw new AppError("OTP is required.", 400);
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("OTP must be a 6-digit number.", 400);
  }
};

