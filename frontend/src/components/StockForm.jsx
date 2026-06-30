import { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { createQrDataUrl } from "../services/barcodeService.js";
import FormInput from "./FormInput.jsx";

const categories = [
  "Ring",
  "Necklace",
  "Bangle",
  "Chain",
  "Pendant",
  "Coin",
  "Ear Ring",
  "Bracelet",
  "Other"
];

const purities = ["18K", "20K", "22K", "24K"];

const StockForm = ({
  register,
  errors,
  user,
  watch,
  isEditMode,
  generatingItemNumber,
  generatingBarcode,
  onGenerateItemNumber,
  onGenerateBarcode
}) => {
  const createdDate = new Date().toLocaleDateString("en-IN");
  const createdTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const barcodeValue = watch("barcode");
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    if (!barcodeValue) {
      setQrSrc("");
      return;
    }
    let ignore = false;
    createQrDataUrl(barcodeValue).then((url) => {
      if (!ignore) setQrSrc(url);
    });
    return () => {
      ignore = true;
    };
  }, [barcodeValue]);

  return (
    <div className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl text-mocha-900">Stock Information</h3>
      <p className="mt-2 text-sm text-mocha-700">
        Enter all stock details manually and generate the jewellery label before saving.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-5">
          {/* Item Number */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-mocha-800">Item Number *</span>
              <button
                type="button"
                onClick={onGenerateItemNumber}
                disabled={generatingItemNumber}
                className="inline-flex items-center gap-2 rounded-xl border border-[#ead7b4] px-3 py-2 text-xs font-semibold text-mocha-900 disabled:opacity-60"
              >
                <FiRefreshCcw size={14} />
                {generatingItemNumber ? "Generating..." : "Generate Next"}
              </button>
            </div>
            <input
              type="text"
              {...register("itemNumber", { required: "Item Number is required." })}
              className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            />
            {errors.itemNumber ? (
              <p className="text-sm text-red-600">{errors.itemNumber.message}</p>
            ) : null}
          </div>

          <FormInput
            label="Item Name *"
            name="itemName"
            placeholder="Gold Ring"
            register={register}
            rules={{ required: "Item Name is required." }}
            error={errors.itemName}
          />

          {/* Category */}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-mocha-800">Category *</span>
            <select
              {...register("category", { required: "Category is required." })}
              className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            ) : null}
          </label>

          <FormInput
            label="Supplier"
            name="supplier"
            placeholder="Supplier name (optional)"
            register={register}
            error={errors.supplier}
          />

          <FormInput
            label="Gross Weight (g) *"
            name="grossWeight"
            type="number"
            placeholder="0.000"
            register={register}
            rules={{
              required: "Gross Weight is required.",
              min: { value: 0.001, message: "Gross Weight must be greater than zero." }
            }}
            error={errors.grossWeight}
          />

          <FormInput
            label="Net Weight (g)"
            name="netWeight"
            type="number"
            placeholder="0.000"
            register={register}
            error={errors.netWeight}
          />
        </div>

        <div className="space-y-5">
          {/* Purity */}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-mocha-800">Purity *</span>
            <select
              {...register("purity", { required: "Purity is required." })}
              className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            >
              <option value="">Select purity</option>
              {purities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.purity ? (
              <p className="mt-1 text-sm text-red-600">{errors.purity.message}</p>
            ) : null}
          </label>

          <FormInput
            label="Pieces / Count *"
            name="count"
            type="number"
            placeholder="1"
            register={register}
            rules={{
              required: "Pieces / Count is required.",
              min: { value: 1, message: "Count must be at least 1." }
            }}
            error={errors.count}
          />

          {/* Barcode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-mocha-800">Barcode</span>
              <button
                type="button"
                onClick={onGenerateBarcode}
                disabled={generatingBarcode || !watch("itemNumber")}
                className="rounded-xl border border-[#ead7b4] px-3 py-2 text-xs font-semibold text-mocha-900 disabled:opacity-50"
              >
                {generatingBarcode ? "Generating..." : "Generate Barcode"}
              </button>
            </div>
            <input
              type="text"
              {...register("barcode")}
              className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            />
            {qrSrc ? (
              <div className="mt-1 flex items-center gap-4 rounded-2xl border border-[#e6d7bf] bg-[#fffaf1] p-3">
                <img
                  src={qrSrc}
                  alt="Barcode QR"
                  className="h-20 w-20 flex-shrink-0 rounded-xl border border-[#ead7b4] bg-white object-contain p-1"
                />
                <div className="min-w-0 text-xs text-mocha-700">
                  <p className="font-semibold text-mocha-900">QR Code Generated</p>
                  <p className="mt-1 break-all font-mono text-[11px]">{barcodeValue}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Description */}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-mocha-800">Description</span>
            <textarea
              rows="4"
              {...register("description")}
              className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            />
          </label>

          {/* Meta info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">Created By</p>
              <p className="mt-2 text-sm font-semibold text-mocha-900">
                {user?.name || "Authorized User"}
              </p>
            </div>
            <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">Created Date</p>
              <p className="mt-2 text-sm font-semibold text-mocha-900">{createdDate}</p>
            </div>
            <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">Created Time</p>
              <p className="mt-2 text-sm font-semibold text-mocha-900">{createdTime}</p>
            </div>
            <div className="rounded-2xl bg-[#fffaf1] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-mocha-700">Status</p>
              <p className="mt-2 text-sm font-semibold text-emerald-700">Available</p>
            </div>
          </div>

          {isEditMode ? (
            <div className="rounded-2xl border border-[#ead7b4] bg-[#fffaf1] px-4 py-3 text-sm text-mocha-700">
              Edit mode is active. Saving will update this stock item.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StockForm;
