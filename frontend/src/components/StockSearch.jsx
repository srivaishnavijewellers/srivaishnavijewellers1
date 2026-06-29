import { FiSearch } from "react-icons/fi";

const StockSearch = ({ value, onChange }) => (
  <div className="relative">
    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-700" />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by item number, item name, barcode, or category"
      className="w-full rounded-2xl border border-[#ead7b4] bg-white py-3 pl-11 pr-4 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
    />
  </div>
);

export default StockSearch;

