import { useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiLogOut, FiShield } from "react-icons/fi";
import Alert from "../Alert.jsx";
import { logoutRequest } from "../../services/authService.js";
import { clearSession } from "../../utils/authStorage.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const InfoRow = ({ label, value, badge }) => (
  <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
    {badge ? (
      <span
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
      >
        <FiCheckCircle size={11} />
        {value}
      </span>
    ) : (
      <p className="mt-2 text-sm font-semibold text-mocha-900">{value || "—"}</p>
    )}
  </div>
);

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

const SecuritySettings = ({ user, session, onLogout }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmAll, setConfirmAll] = useState(false);

  const handleLogoutCurrent = async () => {
    setLoggingOut(true);
    setAlert(null);
    try {
      await logoutRequest();
    } finally {
      clearSession();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  const expiresAt = session?.expiresAt
    ? formatDateTime(session.expiresAt)
    : "—";

  const sessionStart = session?.expiresAt
    ? formatDateTime(
        session.expiresAt - 7 * 24 * 60 * 60 * 1000
      )
    : "—";

  return (
    <div className="space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* JWT / Session Info */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Session Information</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow
            label="JWT Status"
            value="Active"
            badge="bg-emerald-100 text-emerald-700"
          />
          <InfoRow label="Session Expires"  value={expiresAt} />
          <InfoRow label="Remember Me"      value={session?.rememberMe ? "Yes" : "No"} />
          <InfoRow label="Logged-in As"     value={user?.name} />
          <InfoRow label="Role"             value={user?.role} />
          <InfoRow label="Account Status"   value={user?.status} />
        </div>
      </div>

      <div className="border-t border-[#ead7b4]" />

      {/* Actions */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Session Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogoutCurrent}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1] disabled:opacity-60"
          >
            <FiLogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout from Current Device"}
          </button>

          {!confirmAll ? (
            <button
              type="button"
              onClick={() => setConfirmAll(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <FiAlertTriangle size={16} />
              Logout from All Devices
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2">
              <span className="text-sm text-red-700">Confirm logout from all devices?</span>
              <button
                type="button"
                onClick={handleLogoutCurrent}
                className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Yes, Logout
              </button>
              <button
                type="button"
                onClick={() => setConfirmAll(false)}
                className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 flex items-start gap-2 text-xs text-mocha-600">
          <FiShield size={12} className="mt-0.5 shrink-0" />
          Logging out will immediately invalidate your session and require a fresh login with OTP verification.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;
