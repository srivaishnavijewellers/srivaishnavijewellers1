import { FiBox, FiLayers, FiPackage } from "react-icons/fi";

const cards = [
  {
    key: "totalItems",
    label: "Total Stock Items",
    icon: FiPackage,
    iconWrap: "bg-[#f8e3ae] text-[#8f6720]"
  },
  {
    key: "totalWeight",
    label: "Total Weight (Grams)",
    icon: FiBox,
    iconWrap: "bg-[#d9ebff] text-[#245ea8]",
    suffix: " g"
  },
  {
    key: "totalCategories",
    label: "Total Categories",
    icon: FiLayers,
    iconWrap: "bg-[#dff5df] text-[#2e7d32]"
  }
];

const SummarySkeleton = () => (
  <div className="grid gap-4 lg:grid-cols-3">
    {cards.map((card) => (
      <div
        key={card.key}
        className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm"
      >
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#f3e6c8]" />
        <div className="mt-5 h-4 w-28 animate-pulse rounded bg-[#f3e6c8]" />
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[#f3e6c8]" />
      </div>
    ))}
  </div>
);

const SummaryCards = ({ loading, summary }) => {
  if (loading) {
    return <SummarySkeleton />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, iconWrap, suffix = "" }) => (
        <article
          key={key}
          className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrap}`}>
            <Icon size={22} />
          </div>
          <p className="mt-5 text-sm text-mocha-700">{label}</p>
          <h2 className="mt-2 font-display text-4xl text-mocha-900">
            {summary?.[key] ?? 0}
            {suffix}
          </h2>
        </article>
      ))}
    </div>
  );
};

export default SummaryCards;

