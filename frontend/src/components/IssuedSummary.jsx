import { FiBox, FiCalendar, FiPackage, FiUsers } from "react-icons/fi";

const cards = [
  {
    key: "totalItems",
    label: "Total Issued Items",
    icon: FiPackage,
    iconWrap: "bg-[#f8e3ae] text-[#8f6720]"
  },
  {
    key: "totalWeight",
    label: "Total Issued Weight (g)",
    icon: FiBox,
    iconWrap: "bg-[#d9ebff] text-[#245ea8]",
    suffix: " g"
  },
  {
    key: "totalCustomers",
    label: "Total Issued Customers",
    icon: FiUsers,
    iconWrap: "bg-[#dff5df] text-[#2e7d32]",
    fallback: "-"
  },
  {
    key: "todayItems",
    label: "Today's Issued Items",
    icon: FiCalendar,
    iconWrap: "bg-[#ffe4e4] text-[#d32f2f]"
  }
];

const SummarySkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {cards.map((card) => (
      <div
        key={card.key}
        className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm"
      >
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#f3e6c8]" />
        <div className="mt-5 h-4 w-32 animate-pulse rounded bg-[#f3e6c8]" />
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[#f3e6c8]" />
      </div>
    ))}
  </div>
);

const IssuedSummary = ({ loading, summary }) => {
  if (loading) {
    return <SummarySkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, iconWrap, suffix = "", fallback = null }) => {
        const val = summary?.[key];
        const displayValue = val !== undefined && val !== null ? `${val}${suffix}` : (fallback || "0");
        return (
          <article
            key={key}
            className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrap}`}>
              <Icon size={22} />
            </div>
            <p className="mt-5 text-sm text-mocha-700">{label}</p>
            <h2 className="mt-2 font-display text-3xl xl:text-4xl text-mocha-900 truncate">
              {displayValue}
            </h2>
          </article>
        );
      })}
    </div>
  );
};

export default IssuedSummary;
