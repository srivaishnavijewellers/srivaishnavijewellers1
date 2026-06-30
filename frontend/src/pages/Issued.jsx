import { useEffect, useMemo, useState } from "react";
import { FiBox, FiRefreshCw } from "react-icons/fi";
import Alert from "../components/Alert.jsx";
import Pagination from "../components/Pagination.jsx";
import IssuedCard from "../components/IssuedCard.jsx";
import IssuedSearch from "../components/IssuedSearch.jsx";
import IssuedSummary from "../components/IssuedSummary.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, logoutRequest } from "../services/authService.js";
import { getIssuedStocks } from "../services/issuedService.js";
import { clearSession, getStoredSession, isSessionExpired } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const ITEMS_PER_PAGE = 10;

const getTodayCount = (items) => {
  const today = new Date();
  return items.filter((item) => {
    // try issueDate first, then fallback to createdAt
    const dateToUse = item.issueDate || item.createdAt;
    if (!dateToUse) return false;
    const itemDate = new Date(dateToUse);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  }).length;
};

const Issued = () => {
  const session = getStoredSession();
  const [user, setUser] = useState(session?.user || null);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    purity: "All",
    sortBy: "newest"
  });
  const [currentPage, setCurrentPage] = useState(1);
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

  const loadPageData = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const [stocksData, profileData] = await Promise.all([
        getIssuedStocks({
          search: searchQuery,
          status: filters.status,
          category: filters.category,
          purity: filters.purity,
          sortBy: filters.sortBy
        }),
        getProfile()
      ]);

      setItems(stocksData.items || []);
      setUser(profileData.user);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to fetch issued stock. Please try again.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [searchQuery, filters.status, filters.category, filters.purity, filters.sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.status, filters.category, filters.purity, filters.sortBy]);

  const summary = useMemo(() => {
    const uniqueCustomers = new Set(items.map((item) => item.issuedTo).filter(Boolean));
    const totalWeight = items.reduce((sum, item) => sum + (Number(item.grossWeight ?? item.weight) || 0), 0);

    return {
      totalItems: items.length,
      totalWeight: Number(totalWeight.toFixed(3)),
      totalCustomers: uniqueCustomers.size > 0 ? uniqueCustomers.size : null,
      todayItems: getTodayCount(items)
    };
  }, [items]);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort(),
    [items]
  );
  const purities = useMemo(
    () => [...new Set(items.map((item) => item.purity).filter(Boolean))].sort(),
    [items]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(
    () =>
      items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [currentPage, items]
  );

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

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <DashboardLayout
      title="Issued Stock"
      subtitle="View all jewellery items currently issued from the showroom."
      user={user}
      onLogout={handleLogout}
      activeMenu="issued"
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-mocha-900">Issued Stock</h2>
          <p className="mt-1 text-sm text-mocha-700">
            View all jewellery items currently issued from the showroom.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadPageData}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-4 py-3 text-sm font-semibold text-mocha-900"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {alert ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
          <Alert type={alert.type} message={alert.message} />
          <button
            type="button"
            onClick={loadPageData}
            className="mt-4 rounded-2xl bg-mocha-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-6">
        <IssuedSummary loading={loading} summary={summary} />
      </div>

      <section className="mt-6">
        <IssuedSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          purities={purities}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </section>

      <section className="mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-40 animate-pulse rounded-3xl border border-[#ead7b4] bg-white shadow-sm"
              />
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e5c983] bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6e7bc] text-[#8f6720]">
              <FiBox size={28} />
            </div>
            <h3 className="mt-5 font-display text-2xl text-mocha-900">No Issued Stock Found</h3>
            <p className="mt-2 text-sm text-mocha-700">
              All stock items are currently available.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedItems.map((item) => (
                <IssuedCard key={item._id} item={item} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Issued;
