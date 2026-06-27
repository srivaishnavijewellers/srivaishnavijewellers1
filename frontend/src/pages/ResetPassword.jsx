import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AuthCard from "../components/AuthCard.jsx";
import FormInput from "../components/FormInput.jsx";
import useCountdown from "../hooks/useCountdown.js";
import { resendOtpCode, resetPasswordRequest } from "../services/authService.js";
import {
  clearResetContext,
  getResetContext,
  saveResetContext
} from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const context = getResetContext();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [baseTime, setBaseTime] = useState(() => {
    const sentAt = context?.sentAt || Date.now();
    return Math.max(0, 300 - Math.floor((Date.now() - sentAt) / 1000));
  });
  const secondsLeft = useCountdown(baseTime);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    if (!context?.email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [context?.email, navigate]);

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    setResending(true);
    setAlert(null);

    try {
      const sentAt = Date.now();
      await resendOtpCode({ email: context.email, purpose: "RESET" });
      saveResetContext({ ...context, sentAt });
      setBaseTime(300);
      setAlert({ type: "success", message: "A new OTP has been sent." });
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to resend OTP.")
      });
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setAlert(null);

    try {
      await resetPasswordRequest({
        email: context.email,
        otp: values.otp,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      clearResetContext();
      navigate("/login", {
        replace: true,
        state: { successMessage: "Password updated successfully." }
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to reset password.")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset Password" subtitle={`Verify the OTP sent to ${context?.email || "your email"} and choose a new password.`}>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Alert type={alert?.type} message={alert?.message} />

        <div className="rounded-2xl border border-gold-100 bg-gold-100/40 px-4 py-3 text-sm text-mocha-800">
          Reset OTP expires in{" "}
          <span className="font-semibold">
            {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
            {String(secondsLeft % 60).padStart(2, "0")}
          </span>
        </div>

        <FormInput
          label="OTP"
          name="otp"
          placeholder="Enter 6-digit OTP"
          register={register}
          rules={{
            required: "OTP is required.",
            pattern: {
              value: /^\d{6}$/,
              message: "OTP must be a 6-digit number."
            }
          }}
          error={errors.otp}
        />

        <FormInput
          label="New Password"
          name="password"
          type="password"
          placeholder="6 to 30 characters"
          register={register}
          rules={{
            required: "New password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters."
            },
            maxLength: {
              value: 30,
              message: "Password must be at most 30 characters."
            }
          }}
          error={errors.password}
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter new password"
          register={register}
          rules={{
            required: "Please confirm your password."
          }}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-mocha-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-mocha-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          type="button"
          disabled={secondsLeft > 0 || resending}
          onClick={handleResend}
          className="font-semibold text-gold-700 disabled:cursor-not-allowed disabled:text-gold-300"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
        <Link className="font-semibold text-gold-700" to="/login">
          Return to Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
