import nodemailer from "nodemailer";
import { AppError } from "../utils/appError.js";

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new AppError("Email service is not configured.", 500);
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
};

export const sendOtpEmail = async ({ email, otp, purpose }) => {
  const subject =
    purpose === "RESET"
      ? "Sri Vaishnavi Jewellers - Password Reset Verification"
      : "Sri Vaishnavi Jewellers - Login Verification";

  const bodyLines = [
    "Hello,",
    "",
    `Your One Time Password (OTP) for ${
      purpose === "RESET" ? "resetting your password" : "logging into the Sri Vaishnavi Jewellers Stock Management Portal"
    } is:`,
    "",
    otp,
    "",
    "This OTP is valid for 5 minutes.",
    "",
    "Do not share this OTP with anyone.",
    "",
    "If you did not request this action, please ignore this email.",
    "",
    "Regards,",
    "",
    "Sri Vaishnavi Jewellers"
  ];

  await getTransporter().sendMail({
    from: `"Sri Vaishnavi Jewellers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: bodyLines.join("\n")
  });
};

