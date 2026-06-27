import { useEffect, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";

const TopNavbar = ({ title, subtitle, user, onMenuToggle }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[#ead7b4] bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="mt-1 rounded-xl border border-[#ead7b4] p-2 text-mocha-900 md:hidden"
          >
            <FiMenu size={20} />
          </button>
          <div>
            <h1 className="font-display text-3xl text-mocha-900">{title}</h1>
            <p className="mt-1 text-sm text-mocha-700">
              {subtitle || `Welcome back, ${user?.name || "Super Admin"}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-start rounded-2xl border border-[#f0e2c5] bg-[#fffaf1] px-4 py-3 lg:self-auto">
          <div className="text-right">
            <p className="text-sm font-semibold text-mocha-900">
              {now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </p>
            <p className="text-sm text-mocha-700">
              {now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d5ad58] text-mocha-900">
            <FiUser size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

