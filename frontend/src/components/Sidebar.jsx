import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiGrid,
  FiLogOut,
  FiPlusCircle,
  FiSettings,
  FiX,
  FiList
} from "react-icons/fi";

const baseItems = [
  { label: "Dashboard",        icon: FiGrid,       key: "dashboard",        path: "/dashboard" },
  { label: "Stock Management", icon: FiBox,        key: "stock-management", path: "/stock-management" },
  { label: "Add Stock",        icon: FiPlusCircle, key: "add-stock",        path: "/add-stock" },
  { label: "Issued",           icon: FiList,       key: "issued",           path: "/issued" }
];

const adminItems = [
  { label: "Settings", icon: FiSettings, key: "settings", path: "/settings" }
];

const Sidebar = ({ open, onClose, onLogout, activeMenu = "dashboard", user }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const menuItems = [...baseItems, ...adminItems];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col bg-[#3E2723] px-5 py-6 text-white transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between md:block">
          <div>
            <p className="font-display text-2xl leading-tight text-white">
              Sri Vaishnavi Jewellers
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#ecd08f]">
              Stock Management Portal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/80 md:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ label, icon: Icon, key, path }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                navigate(path);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                activeMenu === key
                  ? "bg-[#d5ad58] text-mocha-900"
                  : "text-white hover:bg-[#d9b76b] hover:text-mocha-900"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          {user && (
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ecd08f]">
                {user.role}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {user.name}
              </p>
            </div>
          )}

          {confirmLogout ? (
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              <p className="font-semibold text-white">Are you sure you want to logout?</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 rounded-xl bg-[#d5ad58] px-3 py-2 font-semibold text-mocha-900"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-xl border border-white/20 px-3 py-2 font-semibold text-white"
                >
                  No
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
