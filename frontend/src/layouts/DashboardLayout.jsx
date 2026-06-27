import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";

const DashboardLayout = ({
  title,
  subtitle,
  onLogout,
  user,
  activeMenu,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f1e6] text-mocha-900">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
          activeMenu={activeMenu}
          user={user}
        />
        <div className="min-w-0 flex-1">
          <TopNavbar
            title={title}
            subtitle={subtitle}
            user={user}
            onMenuToggle={() => setSidebarOpen((current) => !current)}
          />
          <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
