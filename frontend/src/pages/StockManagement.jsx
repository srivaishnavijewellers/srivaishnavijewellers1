import { useEffect, useMemo, useState } from "react";
import { FiBox, FiPlusCircle, FiRefreshCw } from "react-icons/fi";
import Alert from "../components/Alert.jsx";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";
import Pagination from "../components/Pagination.jsx";
import StockCard from "../components/StockCard.jsx";
import StockDetailsModal from "../components/StockDetailsModal.jsx";
import StockFilter from "../components/StockFilter.jsx";
import StockSearch from "../components/StockSearch.jsx";
import StockSummaryCards from "../components/StockSummaryCards.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, logoutRequest } from "../services/authService.js";
import { deleteStock, getStockById, getStocks } from "../services/stockService.js";
import { clearSession, getStoredSession, isSessionExpired } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const ITEMS_PER_PAGE = 10;

const getTodayCount = (items) => {
  const today = new Date();
  return items.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return (
      createdAt.getDate() === today.getDate() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;
};

const StockManagement = () => {
  const session = getStoredSession();
  const [user, setUser] = useState(session?.user || null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    purity: "",
    sortBy: "newest"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        getStocks({
          search,
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
        message: getErrorMessage(error, "Unable to fetch stock. Please try again.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [search, filters.category, filters.purity, filters.sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters.category, filters.purity, filters.sortBy]);

  const summary = useMemo(() => {
    const categories = new Set(items.map((item) => item.category).filter(Boolean));
    const totalWeight = items.reduce((sum, item) => sum + (Number(item.grossWeight ?? item.weight) || 0), 0);

    return {
      totalItems: items.length,
      totalWeight: Number(totalWeight.toFixed(3)),
      totalCategories: categories.size,
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

  const handleView = async (item) => {
    try {
      const response = await getStockById(item._id);
      setSelectedItem(response.item);
      setViewOpen(true);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to load stock details.")
      });
    }
  };

  const handleEdit = (item) => {
    window.location.assign(`/add-stock?mode=edit&id=${item._id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteStock(deleteTarget._id);
      setDeleteTarget(null);
      await loadPageData();
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to delete stock item.")
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Stock Management"
      subtitle="View, Search and Manage Jewellery Stock"
      user={user}
      onLogout={handleLogout}
      activeMenu="stock-management"
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-mocha-900">Stock Management</h2>
          <p className="mt-1 text-sm text-mocha-700">
            View, Search and Manage Jewellery Stock
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
          <button
            type="button"
            onClick={() => window.location.assign("/add-stock")}
            className="inline-flex items-center gap-2 rounded-2xl bg-mocha-900 px-4 py-3 text-sm font-semibold text-white"
          >
            <FiPlusCircle size={16} />
            Add Stock
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
        <StockSummaryCards loading={loading} summary={summary} />
      </div>

      <section className="mt-6 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
        <div className="grid gap-4">
          <StockSearch value={search} onChange={setSearch} />
          <StockFilter
            categories={categories}
            purities={purities}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
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
            <h3 className="mt-5 font-display text-2xl text-mocha-900">No Stock Available</h3>
            <p className="mt-2 text-sm text-mocha-700">
              Click "Add Stock" to create your first stock entry.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedItems.map((item) => (
                <StockCard
                  key={item._id}
                  item={item}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
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

      <StockDetailsModal
        open={viewOpen}
        item={selectedItem}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
      />
      <DeleteConfirmationModal
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.itemName}
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
};

export default StockManagement;

