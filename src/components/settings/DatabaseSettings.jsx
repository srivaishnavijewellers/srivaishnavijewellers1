import { useEffect, useState } from "react";
import { FiCheckCircle, FiRefreshCw, FiXCircle } from "react-icons/fi";
import Alert from "../Alert.jsx";
import { fetchSystemStatus } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const StatusBadge = ({ value }) => {
  const good = value === "Connected" || value === "Online";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        good ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
      }`}
    >
      {good ? <FiCheckCircle size={11} /> : <FiXCircle size={11} />}
      {value}
    </span>
  );
};

const StatCard = ({ label, value, suffix = "" }) => (
  <article className="rounded-2xl border border-[#ead7b4] bg-white p-4 shadow-sm">
    <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
    <p className="mt-2 font-display text-3xl text-mocha-900">
      {value ?? "—"}
      {suffix && (
        <span className="ml-1 text-sm font-normal text-mocha-700">{suffix}</span>
      )}
    </p>
  </article>
);

const DatabaseSettings = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const data = await fetchSystemStatus();
      setStatus(data);
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to fetch system status.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* System Status */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">System Status</p>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-14 animate-pulse rounded-2xl border border-[#ead7b4] bg-[#fffaf1]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-sm font-semibold text-mocha-900">Database</p>
              <StatusBadge value={status?.dbStatus || "Unknown"} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-sm font-semibold text-mocha-900">API Server</p>
              <StatusBadge value={status?.apiStatus || "Unknown"} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-sm font-semibold text-mocha-900">MongoDB</p>
              <StatusBadge value={status?.dbStatus || "Unknown"} />
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Database Statistics</p>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-20 animate-pulse rounded-2xl border border-[#ead7b4] bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Stock Items"  value={status?.totalItems}      />
            <StatCard label="Total Categories"   value={status?.totalCategories} />
            <StatCard label="Total Weight"       value={status?.totalWeight}     suffix="g" />
            <StatCard label="Total Users"        value={status?.totalUsers}      />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1] disabled:opacity-60"
        >
          <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
};

export default DatabaseSettings;
