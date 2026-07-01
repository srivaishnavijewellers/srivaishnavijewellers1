const StockFilter = ({
  categories,
  designNames,
  filters,
  onFilterChange
}) => (
  <div className="grid gap-4 lg:grid-cols-3">
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-mocha-800">Category</span>
      <select
        value={filters.category}
        onChange={(event) => onFilterChange("category", event.target.value)}
        className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>

    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-mocha-800">Design Name</span>
      <select
        value={filters.designName}
        onChange={(event) => onFilterChange("designName", event.target.value)}
        className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
      >
        <option value="">All Design Names</option>
        {designNames.map((designName) => (
          <option key={designName} value={designName}>
            {designName}
          </option>
        ))}
      </select>
    </label>

    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-mocha-800">Sort</span>
      <select
        value={filters.sortBy}
        onChange={(event) => onFilterChange("sortBy", event.target.value)}
        className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="weight_desc">Weight High to Low</option>
        <option value="weight_asc">Weight Low to High</option>
      </select>
    </label>
  </div>
);

export default StockFilter;

