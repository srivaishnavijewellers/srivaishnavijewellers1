import { useEffect, useState } from "react";
import Alert from "../components/Alert.jsx";
import RecentStockTable from "../components/RecentStockTable.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import SystemStatusCard from "../components/SystemStatusCard.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, logoutRequest } from "../services/authService.js";
import {
  getDashboardSummary,
  getRecentStock,
  getSystemStatus
} from "../services/dashboardService.js";
import { clearSession, getStoredSession, isSessionExpired } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const Dashboard = () => {
  const session = getStoredSession();
  const [summary, setSummary] = useState(null);
  const [recentStock, setRecentStock] = useState([]);
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(session?.user || null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!session || isSessionExpired(session)) {
      clearSession();
      window.location.replace("/login");
      return;
    }

    const timeout = window.setTimeout(() => {
      clearSession();
      window.location.replace("/login");
    }, Math.max(0, session.expiresAt - Date.now()));

    return () => window.clearTimeout(timeout);
  }, [session]);

  const loadDashboard = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const [summaryData, recentData, statusData, profileData] = await Promise.all([
        getDashboardSummary(),
        getRecentStock(),
        getSystemStatus(),
        getProfile()
      ]);

      setSummary(summaryData);
      setRecentStock(recentData.items || []);
      setStatus(statusData);
      setUser(profileData.user);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to load dashboard. Please try again.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name || "Super Admin"}`}
      user={user}
      onLogout={handleLogout}
      activeMenu="dashboard"
    >
      {alert ? (
        <div className="mb-6 rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
          <Alert type={alert.type} message={alert.message} />
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-2xl bg-mocha-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Refresh
          </button>
        </div>
      ) : null}

      <SummaryCards loading={loading} summary={summary} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <RecentStockTable loading={loading} items={recentStock} />
        <SystemStatusCard loading={loading} status={status} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
