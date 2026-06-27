import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCountdown from "../hooks/useCountdown.js";
import { resendOtpCode, verifyOtpCode } from "../services/authService.js";
import {
  clearOtpContext,
  getOtpContext,
  saveOtpContext,
  saveSession
} from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const formatTimer = (seconds) => {
  const m = String(Math.max(0, Math.floor(seconds / 60))).padStart(2, "0");
  const s = String(Math.max(0, seconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
};

const DIGITS = 6;

const VerifyOTP = () => {
  const navigate = useNavigate();
  const context = getOtpContext();

  const [digits, setDigits] = useState(Array(DIGITS).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [baseTime] = useState(() => {
    const sentAt = context?.sentAt || Date.now();
    return Math.max(0, 300 - Math.floor((Date.now() - sentAt) / 1000));
  });
  const [countBase, setCountBase] = useState(baseTime);
  const secondsLeft = useCountdown(countBase);

  const refs = useRef([]);

  useEffect(() => {
    if (!context?.email) {
      navigate("/login", { replace: true });
    } else {
      refs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");
    if (char && index < DIGITS - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < DIGITS - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    if (!pasted) return;
    const next = Array(DIGITS).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, DIGITS - 1);
    refs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < DIGITS) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await verifyOtpCode({
        email: context.email,
        otp,
        rememberMe: context.rememberMe
      });
      saveSession({
        token: response.token,
        expiresIn: response.expiresIn,
        user: response.user,
        rememberMe: context.rememberMe
      });
      clearOtpContext();
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "OTP verification failed. Please try again."));
      setDigits(Array(DIGITS).fill(""));
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await resendOtpCode({ email: context.email, purpose: context.purpose });
      saveOtpContext({ ...context, sentAt: Date.now() });
      setCountBase(300);
      setDigits(Array(DIGITS).fill(""));
      setSuccess("A new OTP has been sent to your email.");
      refs.current[0]?.focus();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to resend OTP."));
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = context?.email
    ? context.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1e6] px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="font-display text-2xl text-mocha-900">Sri Vaishnavi Jewellers</p>
          <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#8f6720]">
            Stock Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#ead7b4] bg-white p-8 shadow-sm">

          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e3ae]">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-[#8f6720]" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="mt-4 text-center font-display text-2xl text-mocha-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-mocha-700">
            Enter the 6-digit code sent to
          </p>
          <p className="text-center text-sm font-semibold text-mocha-900">{maskedEmail}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* Digit boxes */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoComplete="off"
                  className={`h-12 w-11 rounded-2xl border text-center text-lg font-bold text-mocha-900 outline-none transition
                    ${digit
                      ? "border-[#d5ad58] bg-[#fffdf4] ring-2 ring-[#f0d890]"
                      : "border-[#e6d7bf] bg-[#fffdfa]"
                    }
                    focus:border-[#d5ad58] focus:ring-2 focus:ring-[#f0d890]`}
                />
              ))}
            </div>

            {/* Error / Success */}
            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
                {success}
              </p>
            )}

            {/* Timer */}
            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  secondsLeft <= 30 ? "text-red-500" : "text-mocha-700"
                }`}
              >
                {secondsLeft > 0
                  ? `Expires in ${formatTimer(secondsLeft)}`
                  : "OTP expired"}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || digits.join("").length < DIGITS}
              className="w-full rounded-2xl bg-mocha-900 py-3 text-sm font-semibold text-white transition hover:bg-mocha-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Footer actions */}
          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || resending}
              className="font-semibold text-[#8f6720] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
            <Link
              to="/login"
              className="font-semibold text-mocha-700 transition hover:text-mocha-900"
            >
              Change Email
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-mocha-600">
          Check your spam folder if you don't see the email.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
