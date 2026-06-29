import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiDatabase,
  FiInfo,
  FiPrinter,
  FiSave,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiUser
} from "react-icons/fi";
import Alert from "../components/Alert.jsx";
import AboutSettings from "../components/settings/AboutSettings.jsx";
import BarcodeSettings from "../components/settings/BarcodeSettings.jsx";
import DatabaseSettings from "../components/settings/DatabaseSettings.jsx";
import GoldRateSettings from "../components/settings/GoldRateSettings.jsx";
import PrinterSettings from "../components/settings/PrinterSettings.jsx";
import ProfileSettings from "../components/settings/ProfileSettings.jsx";
import SecuritySettings from "../components/settings/SecuritySettings.jsx";
import ShopSettings from "../components/settings/ShopSettings.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, logoutRequest } from "../services/authService.js";
import { fetchSettings, saveSettings } from "../services/settingsService.js";
import { clearSession, getStoredSession, isSessionExpired } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const SECTIONS = [
  { key: "shop",     label: "Shop Information",         icon: FiShoppingBag },
  { key: "gold",     label: "Gold Rate Settings",        icon: FiStar },
  { key: "barcode",  label: "Barcode & Label Settings",  icon: FiTag },
  { key: "profile",  label: "User Profile",              icon: FiUser },
  { key: "security", label: "Security",                  icon: FiShield },
  { key: "printer",  label: "Printer Settings",          icon: FiPrinter },
  { key: "database", label: "Database Information",      icon: FiDatabase },
  { key: "about",    label: "About Application",         icon: FiInfo }
];

const AccordionSection = ({ section, isOpen, onToggle, children }) => {
  const Icon = section.icon;
  return (
    <div className="overflow-hidden rounded-3xl border border-[#ead7b4] bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#fffaf1]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8e3ae] text-[#8f6720]">
            <Icon size={17} />
          </div>
          <span className="font-display text-xl text-mocha-900">{section.label}</span>
        </div>
        <FiChevronDown
          size={18}
          className={`text-mocha-700 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-[#ead7b4] px-5 py-6">{children}</div>
      )}
    </div>
  );
};

const Settings = () => {
  const session = getStoredSession();
  const [user, setUser] = useState(session?.user || null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [openSections, setOpenSections] = useState({ shop: true });

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

    const init = async () => {
      try {
        const [profileData, settingsData] = await Promise.all([
          getProfile(),
          fetchSettings()
        ]);
        setUser(profileData.user);
        setSettings(settingsData.settings);
      } catch (err) {
        setAlert({
          type: "error",
          message: getErrorMessage(err, "Unable to load settings.")
        });
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => window.clearTimeout(timeout);
  }, []);

  const reloadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data.settings);
    } catch {
      // silent
    }
  };

  const handleSaveAll = async () => {
    if (!settings) return;
    setSaving(true);
    setAlert(null);
    try {
      await saveSettings({
        shopName:         settings.shopName,
        ownerName:        settings.ownerName,
        shopAddress:      settings.shopAddress,
        phone1:           settings.phone1,
        phone2:           settings.phone2,
        email:            settings.email,
        gstNumber:        settings.gstNumber,
        shopLogo:         settings.shopLogo,
        barcodePrefix:    settings.barcodePrefix,
        itemNumberPrefix: settings.itemNumberPrefix
      });
      setAlert({ type: "success", message: "Settings updated successfully." });
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to save settings.")
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await logoutRequest(); } finally {
      clearSession();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const sectionContent = settings
    ? {
        shop:     <ShopSettings     settings={settings} onSaved={reloadSettings} />,
        gold:     <GoldRateSettings  settings={settings} user={user}  onSaved={reloadSettings} />,
        barcode:  <BarcodeSettings   settings={settings} onSaved={reloadSettings} />,
        profile:  <ProfileSettings   user={user} />,
        security: <SecuritySettings  user={user} session={session} onLogout={handleLogout} />,
        printer:  <PrinterSettings />,
        database: <DatabaseSettings />,
        about:    <AboutSettings />
      }
    : {};

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage application preferences and business information"
      user={user}
      onLogout={handleLogout}
      activeMenu="settings"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-mocha-900">Settings</h2>
          <p className="mt-1 text-sm text-mocha-700">
            Manage application preferences and business information.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-mocha-800 disabled:opacity-60"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {alert && (
        <div className="mt-6">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-3xl border border-[#ead7b4] bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {SECTIONS.map((section) => (
            <AccordionSection
              key={section.key}
              section={section}
              isOpen={!!openSections[section.key]}
              onToggle={() => toggleSection(section.key)}
            >
              {sectionContent[section.key]}
            </AccordionSection>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
