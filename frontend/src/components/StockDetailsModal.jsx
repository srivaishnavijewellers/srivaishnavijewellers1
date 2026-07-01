import { FiX } from "react-icons/fi";

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

const StockDetailsModal = ({ open, item, onClose }) => {
  if (!open || !item) {
    return null;
  }

  const fields = [
    ["Item Number", item.itemNumber],
    ["Barcode", item.barcode || item.itemNumber],
    ["Item Name", item.itemName],
    ["Design Name", item.designName || "-"],
    ["Category", item.category],
    ["Gross Weight", `${item.grossWeight ?? item.weight ?? 0} g`],
    ["Net Weight", `${item.netWeight ?? item.grossWeight ?? item.weight ?? 0} g`],
    ["Purity", item.purity],
    ["Count", item.count ?? "-"],
    ["Supplier", item.supplier || "-"],
    ["Status", item.status || "Available"],
    ["Added By", item.addedBy || "System"],
    ["Created Date", formatDateTime(item.createdAt)],
    ["Updated Date", formatDateTime(item.updatedAt)]
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl text-mocha-900">{item.itemName}</h3>
            <p className="mt-1 text-sm text-mocha-700">
              Read-only stock details for this item.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#ead7b4] p-2 text-mocha-900"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">{label}</p>
              <p className="mt-2 text-sm font-semibold text-mocha-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDetailsModal;

