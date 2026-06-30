import { useState } from "react";
import { FiPrinter, FiWifi, FiWifiOff } from "react-icons/fi";
import Alert from "../Alert.jsx";
import { testLabelRequest, testPrinterRequest } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const StatusBadge = ({ connected }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
      connected
        ? "bg-emerald-100 text-emerald-700"
        : "bg-[#f8e3ae] text-[#8f6720]"
    }`}
  >
    {connected ? <FiWifi size={11} /> : <FiWifiOff size={11} />}
    {connected ? "Connected" : "Not Connected"}
  </span>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
    <p className="mt-2 text-sm font-semibold text-mocha-900">{value}</p>
  </div>
);

const PrinterSettings = () => {
  const [testingPrinter, setTestingPrinter] = useState(false);
  const [testingLabel, setTestingLabel] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleTestPrinter = async () => {
    setTestingPrinter(true);
    setAlert(null);
    try {
      const data = await testPrinterRequest();
      setAlert({ type: "success", message: data.message || "Printer test sent." });
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to reach printer.")
      });
    } finally {
      setTestingPrinter(false);
    }
  };

  const handleTestLabel = async () => {
    setTestingLabel(true);
    setAlert(null);
    try {
      const data = await testLabelRequest();
      setAlert({ type: "success", message: "Test label generated successfully." });
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to generate test label.")
      });
    } finally {
      setTestingLabel(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Printer Status */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Printer Status</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-[#ead7b4] px-4 py-3">
            <div className="flex items-center gap-3">
              <FiPrinter size={18} className="text-mocha-700" />
              <span className="text-sm font-medium text-mocha-900">Thermal Printer</span>
            </div>
            <StatusBadge connected={false} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#ead7b4] px-4 py-3">
            <div className="flex items-center gap-3">
              <FiPrinter size={18} className="text-mocha-700" />
              <span className="text-sm font-medium text-mocha-900">Barcode Printer</span>
            </div>
            <StatusBadge connected={false} />
          </div>
        </div>
      </div>

      {/* Paper / Label Config (Read Only) */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">
          Paper & Label Configuration{" "}
          <span className="font-normal text-mocha-600">(Read Only)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ReadOnlyField label="Paper Width"        value="80 mm" />
          <ReadOnlyField label="Label Width"        value="9 mm" />
          <ReadOnlyField label="Label Height"       value="10 mm" />
          <ReadOnlyField label="Printable Area"     value="5 mm × 10 mm" />
        </div>
      </div>

      {/* Actions */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">Printer Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTestPrinter}
            disabled={testingPrinter}
            className="rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1] disabled:opacity-60"
          >
            {testingPrinter ? "Testing..." : "Test Thermal Printer"}
          </button>
          <button
            type="button"
            onClick={handleTestLabel}
            disabled={testingLabel}
            className="rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1] disabled:opacity-60"
          >
            {testingLabel ? "Generating..." : "Test Jewellery Label Printer"}
          </button>
        </div>
        <p className="mt-3 text-xs text-mocha-600">
          Use these buttons to verify printer alignment before printing actual jewellery tags.
        </p>
      </div>
    </div>
  );
};

export default PrinterSettings;
