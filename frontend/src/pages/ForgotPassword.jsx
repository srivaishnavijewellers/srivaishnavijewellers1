import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AuthCard from "../components/AuthCard.jsx";
import FormInput from "../components/FormInput.jsx";
import { forgotPasswordRequest } from "../services/authService.js";
import { saveResetContext } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setAlert(null);

    try {
      await forgotPasswordRequest({ email: values.email });
      saveResetContext({ email: values.email, sentAt: Date.now() });
      navigate("/reset-password");
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to send password reset OTP.")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot Password" subtitle="Enter your registered email to receive a password reset OTP.">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Alert type={alert?.type} message={alert?.message} />

        <FormInput
          label="Registered Email"
          name="email"
          placeholder="you@example.com"
          register={register}
          rules={{
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address."
            }
          }}
          error={errors.email}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-mocha-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-mocha-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        <Link className="font-semibold text-gold-700" to="/login">
          Back to Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
