import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

const statusClasses = {
  Available: "bg-[#ddf6df] text-[#2e7d32]",
  Issued: "bg-[#fff2cf] text-[#a86e08]",
  Sold: "bg-[#ffe1e1] text-[#b43333]"
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const InfoLine = ({ label, value }) => (
  <p className="text-sm text-mocha-700">
    <span className="font-semibold text-mocha-900">{label} :</span> {value || "-"}
  </p>
);

const StockCard = ({ item, onView, onEdit, onDelete }) => (
  <article className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm transition hover:border-gold-500">
    <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr_1fr_auto]">
      <div className="space-y-2">
        <InfoLine label="Item No" value={item.itemNumber} />
        <h3 className="font-display text-2xl text-mocha-900">{item.itemName}</h3>
        <InfoLine label="Category" value={item.category} />
      </div>

      <div className="space-y-2">
        <InfoLine label="Gross Weight" value={`${item.grossWeight ?? item.weight ?? 0} g`} />
        <InfoLine label="Net Weight" value={`${item.netWeight ?? item.grossWeight ?? item.weight ?? 0} g`} />
        <InfoLine label="Purity" value={item.purity} />
        <InfoLine label="Count" value={item.count ?? "-"} />
      </div>

      <div className="space-y-2">
        <InfoLine label="Barcode" value={item.barcode || item.itemNumber} />
        <InfoLine label="Created" value={formatDate(item.createdAt)} />
        <div className="text-sm text-mocha-700">
          <span className="font-semibold text-mocha-900">Status :</span>{" "}
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              statusClasses[item.status] || "bg-[#f0e5d2] text-mocha-700"
            }`}
          >
            {item.status || "Available"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 xl:flex-col xl:items-end">
        <button
          type="button"
          onClick={() => onView(item)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-4 py-2 text-sm font-semibold text-mocha-900"
        >
          <FiEye size={16} />
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-4 py-2 text-sm font-semibold text-mocha-900"
        >
          <FiEdit2 size={16} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#8b1e1e] px-4 py-2 text-sm font-semibold text-white"
        >
          <FiTrash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  </article>
);

export default StockCard;

