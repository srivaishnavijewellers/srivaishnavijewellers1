import { FiPackage } from "react-icons/fi";

const TableSkeleton = () => (
  <div className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
    <div className="h-6 w-44 animate-pulse rounded bg-[#f3e6c8]" />
    <div className="mt-2 h-4 w-60 animate-pulse rounded bg-[#f3e6c8]" />
    <div className="mt-6 space-y-3">
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="h-12 animate-pulse rounded-2xl bg-[#faf3e6]" />
      ))}
    </div>
  </div>
);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const RecentStockTable = ({ loading, items }) => {
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <section className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-mocha-900">Recently Added Stock</h2>
          <p className="mt-1 text-sm text-mocha-700">
            Latest stock entries appear here automatically, newest first.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-[#e5c983] bg-[#fffaf1] px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6e7bc] text-[#8f6720]">
            <FiPackage size={28} />
          </div>
          <h3 className="mt-5 font-display text-2xl text-mocha-900">No Stock Added Yet</h3>
          <p className="mt-2 text-sm text-mocha-700">
            Start by adding your first stock item.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-mocha-700">
                <th className="px-4">S.No</th>
                <th className="px-4">Item Number</th>
                <th className="px-4">Item Name</th>
                <th className="px-4">Design Name</th>
                <th className="px-4">Category</th>
                <th className="px-4">Gross Wt (g)</th>
                <th className="px-4">Net Wt (g)</th>
                <th className="px-4">Purity</th>
                <th className="px-4">Added Date</th>
                <th className="px-4">Added By</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id} className="rounded-2xl bg-[#fffaf1] text-sm text-mocha-900">
                  <td className="rounded-l-2xl px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">{item.itemNumber}</td>
                  <td className="px-4 py-4 font-semibold">{item.itemName}</td>
                  <td className="px-4 py-4">{item.designName || "-"}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4">{item.grossWeight ?? item.weight ?? 0}</td>
                  <td className="px-4 py-4">{item.netWeight ?? item.grossWeight ?? item.weight ?? 0}</td>
                  <td className="px-4 py-4">{item.purity}</td>
                  <td className="px-4 py-4">{formatDate(item.createdAt)}</td>
                  <td className="rounded-r-2xl px-4 py-4">{item.addedBy || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentStockTable;

