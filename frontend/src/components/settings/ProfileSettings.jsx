import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Alert from "../Alert.jsx";
import { changePassword } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const InfoRow = ({ label, value }) => (
  <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
    <p className="mt-2 text-sm font-semibold text-mocha-900">{value || "—"}</p>
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

const inputCls =
  "w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 pr-12 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100";

const PasswordField = ({ label, name, register, rules, error, show, onToggle }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-mocha-800">{label}</span>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        autoComplete="new-password"
        {...register(name, rules)}
        className={inputCls}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-3 flex items-center text-mocha-700"
      >
        {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </label>
);

const ProfileSettings = ({ user }) => {
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
  });

  const toggle = (key) =>
    setShowPwd((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSubmit = async (data) => {
    setSaving(true);
    setAlert(null);
    try {
      await changePassword(data);
      setAlert({ type: "success", message: "Password changed successfully." });
      reset();
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to change password.")
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Profile Information</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoRow label="Name"       value={user?.name} />
          <InfoRow label="Role"       value={user?.role} />
          <InfoRow label="Email"      value={user?.email} />
          <InfoRow label="Status"     value={user?.status} />
        </div>
      </div>

      <div className="border-t border-[#ead7b4]" />

      {/* Change Password */}
      <div>
        <p className="mb-4 text-sm font-semibold text-mocha-800">Change Password</p>
        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            register={register}
            rules={{ required: "Current password is required." }}
            error={errors.currentPassword}
            show={showPwd.current}
            onToggle={() => toggle("current")}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            register={register}
            rules={{
              required: "New password is required.",
              minLength: { value: 6, message: "Minimum 6 characters." }
            }}
            error={errors.newPassword}
            show={showPwd.new}
            onToggle={() => toggle("new")}
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            register={register}
            rules={{
              required: "Please confirm your new password.",
              validate: (v) =>
                v === watch("newPassword") || "Passwords do not match."
            }}
            error={errors.confirmPassword}
            show={showPwd.confirm}
            onToggle={() => toggle("confirm")}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
