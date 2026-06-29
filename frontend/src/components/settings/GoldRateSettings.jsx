import { useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import Alert from "../Alert.jsx";
import { saveSettings } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

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

const GoldRateSettings = ({ settings, user, onSaved }) => {
  const [rate, setRate] = useState(settings.goldRate ?? 0);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleUpdate = async () => {
    const parsed = Number(rate);
    if (isNaN(parsed) || parsed <= 0) {
      setAlert({ type: "error", message: "Enter a valid gold rate greater than zero." });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      await saveSettings({ goldRate: parsed });
      setAlert({ type: "success", message: "Gold rate updated successfully." });
      onSaved?.();
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to update gold rate.")
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Current Rate Display */}
      <div className="flex flex-col gap-4 rounded-2xl bg-[#fffaf1] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e3ae] text-[#8f6720]">
            <FiTrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">
              Current Gold Rate (per gram)
            </p>
            <p className="mt-1 font-display text-3xl text-mocha-900">
              ₹ {settings.goldRate?.toLocaleString("en-IN") || "0"}
            </p>
          </div>
        </div>
        <div className="text-sm text-mocha-700">
          <p>
            Updated by:{" "}
            <span className="font-semibold text-mocha-900">
              {settings.goldRateUpdatedBy || "—"}
            </span>
          </p>
          <p className="mt-1">
            Date:{" "}
            <span className="font-semibold text-mocha-900">
              {formatDateTime(settings.goldRateUpdatedAt)}
            </span>
          </p>
        </div>
      </div>

      {/* Update Rate */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-2 block text-sm font-semibold text-mocha-800">
            New Gold Rate (₹ per gram)
          </span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          />
        </label>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving}
          className="rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:self-end"
        >
          {saving ? "Updating..." : "Update Gold Rate"}
        </button>
      </div>

      {/* History */}
      {settings.goldRateHistory?.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-mocha-800">Rate History</p>
          <div className="max-h-48 overflow-y-auto rounded-2xl border border-[#ead7b4]">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#ead7b4] bg-[#fffaf1] text-left text-xs uppercase tracking-[0.2em] text-mocha-700">
                  <th className="px-4 py-3">Rate (₹/g)</th>
                  <th className="px-4 py-3">Updated By</th>
                  <th className="px-4 py-3">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {[...settings.goldRateHistory]
                  .reverse()
                  .map((entry, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#ead7b4] last:border-0 text-sm"
                    >
                      <td className="px-4 py-3 font-semibold text-mocha-900">
                        ₹ {entry.rate?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-mocha-700">{entry.updatedBy}</td>
                      <td className="px-4 py-3 text-mocha-700">
                        {formatDateTime(entry.updatedAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldRateSettings;
