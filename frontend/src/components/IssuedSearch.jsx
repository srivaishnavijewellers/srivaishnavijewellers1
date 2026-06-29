import { FiSearch } from "react-icons/fi";

const IssuedSearch = ({
  searchQuery,
  onSearchChange,
  categories,
  purities,
  filters,
  onFilterChange
}) => (
  <div className="space-y-4 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-700" />
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by Item Number, Barcode, Item Name, Customer Name, or Issue Number"
        className="w-full rounded-2xl border border-[#ead7b4] bg-white py-3 pl-11 pr-4 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
      />
    </div>

    <div className="grid gap-4 lg:grid-cols-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-mocha-800">Status</span>
        <select
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
          className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        >
          <option value="All">All Statuses</option>
          <option value="Issued">Issued</option>
          <option value="Overdue">Overdue</option>
          <option value="Returned">Returned</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-mocha-800">Category</span>
        <select
          value={filters.category}
          onChange={(event) => onFilterChange("category", event.target.value)}
          className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-mocha-800">Purity</span>
        <select
          value={filters.purity}
          onChange={(event) => onFilterChange("purity", event.target.value)}
          className="w-full rounded-2xl border border-[#ead7b4] bg-white px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        >
          <option value="All">All Purities</option>
          {purities.map((purity) => (
            <option key={purity} value={purity}>
              {purity}
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
  </div>
);

export default IssuedSearch;
