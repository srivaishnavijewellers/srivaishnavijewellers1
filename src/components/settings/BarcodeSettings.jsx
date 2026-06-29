import { useState } from "react";
import Alert from "../Alert.jsx";
import { saveSettings, testLabelRequest } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const ReadOnlyField = ({ label, value }) => (
  <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
    <p className="mt-2 text-sm font-semibold text-mocha-900">{value}</p>
  </div>
);

const inputCls =
  "w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100";

const BarcodeSettings = ({ settings, onSaved }) => {
  const [barcodePrefix, setBarcodePrefix] = useState(
    settings.barcodePrefix || "SVJ"
  );
  const [itemPrefix, setItemPrefix] = useState(
    settings.itemNumberPrefix || "SVJ"
  );
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);
    try {
      await saveSettings({
        barcodePrefix: barcodePrefix.trim(),
        itemNumberPrefix: itemPrefix.trim()
      });
      setAlert({ type: "success", message: "Barcode settings saved successfully." });
      onSaved?.();
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to save barcode settings.")
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestLabel = async () => {
    setTesting(true);
    setAlert(null);
    try {
      await testLabelRequest();
      setAlert({ type: "success", message: "Test label generated. Check your printer." });
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to generate test label.")
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Editable prefix settings */}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-mocha-800">
            Barcode Prefix
          </span>
          <input
            value={barcodePrefix}
            onChange={(e) => setBarcodePrefix(e.target.value)}
            maxLength={10}
            placeholder="SVJ"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-mocha-600">
            Example barcode: {barcodePrefix || "SVJ"}260627000001
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-mocha-800">
            Item Number Prefix
          </span>
          <input
            value={itemPrefix}
            onChange={(e) => setItemPrefix(e.target.value)}
            maxLength={10}
            placeholder="SVJ"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-mocha-600">
            Example item number: {itemPrefix || "SVJ"}000001
          </p>
        </label>
      </div>

      {/* Read-only label specs */}
      <div>
        <p className="mb-3 text-sm font-semibold text-mocha-800">
          Jewellery Label Specifications{" "}
          <span className="font-normal text-mocha-600">(Read Only)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ReadOnlyField label="Label Width"       value="9 mm" />
          <ReadOnlyField label="Label Height"      value="10 mm" />
          <ReadOnlyField label="Printable Area"    value="5 mm × 10 mm" />
          <ReadOnlyField label="Reserved (Hole)"   value="4 mm" />
          <ReadOnlyField label="QR Code Area"      value="2.5 mm" />
          <ReadOnlyField label="Info Print Area"   value="2.5 mm" />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTestLabel}
            disabled={testing}
            className="rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1] disabled:opacity-60"
          >
            {testing ? "Generating..." : "Print Test Label"}
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Barcode Settings"}
        </button>
      </div>
    </div>
  );
};

export default BarcodeSettings;
