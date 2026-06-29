import { FiCalendar, FiGrid, FiPackage, FiTrendingUp } from "react-icons/fi";

const cards = [
  {
    key: "totalItems",
    label: "Total Stock Items",
    icon: FiPackage,
    tone: "bg-[#f8e3ae] text-[#8f6720]"
  },
  {
    key: "totalWeight",
    label: "Total Stock Weight (g)",
    icon: FiTrendingUp,
    tone: "bg-[#dcecff] text-[#245ea8]",
    suffix: " g"
  },
  {
    key: "totalCategories",
    label: "Total Categories",
    icon: FiGrid,
    tone: "bg-[#ddf6df] text-[#2e7d32]"
  },
  {
    key: "todayItems",
    label: "Today's Added Items",
    icon: FiCalendar,
    tone: "bg-[#f8dfdf] text-[#b43333]"
  }
];

const StockSummaryCards = ({ loading, summary }) => (
  <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
    {cards.map(({ key, label, icon: Icon, tone, suffix = "" }) => (
      <article
        key={key}
        className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm"
      >
        {loading ? (
          <>
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#f4e5c7]" />
            <div className="mt-5 h-4 w-32 animate-pulse rounded bg-[#f4e5c7]" />
            <div className="mt-3 h-9 w-20 animate-pulse rounded bg-[#f4e5c7]" />
          </>
        ) : (
          <>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
              <Icon size={22} />
            </div>
            <p className="mt-5 text-sm text-mocha-700">{label}</p>
            <h2 className="mt-2 font-display text-4xl text-mocha-900">
              {summary[key]}
              {suffix}
            </h2>
          </>
        )}
      </article>
    ))}
  </div>
);

export default StockSummaryCards;

