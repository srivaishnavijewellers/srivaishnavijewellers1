import BarcodePreview from "./BarcodePreview.jsx";

const Row = ({ label, value }) => (
  <div className="flex items-baseline gap-1 leading-tight">
    <span className="shrink-0 text-[8.5px] text-mocha-600">{label} :</span>
    <span className="break-all text-[9px] font-bold text-black">{value}</span>
  </div>
);

const LabelPreview = ({ values }) => (
  <div className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
    <h3 className="font-display text-2xl text-mocha-900">Jewellery Tag Label Preview</h3>
    <p className="mt-2 text-sm text-mocha-700">
      Printable area uses only the left 5 mm of the 9 mm tag. The right 4 mm stays blank for the tag hole.
    </p>

    <div className="mt-6 overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="text-xs uppercase tracking-[0.2em] text-mocha-700">Preview Scale</div>
        <div className="mt-3 flex h-28 w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#d9c08b] bg-[#fffdf7]">

          {/* Printable 5mm area */}
          <div className="flex w-[55.55%] border-r border-dashed border-[#e7d0a2]">

            {/* Left half: QR code */}
            <div className="flex w-1/2 items-center justify-center border-r border-[#ead7b4] p-2">
              <BarcodePreview barcode={values.barcode} itemNumber={values.itemNumber} />
            </div>

            {/* Right half: labeled data */}
            <div className="flex w-1/2 flex-col justify-center gap-[5px] px-2 py-1">
              <Row label="Item No"   value={values.itemNumber || "SVJ000001"} />
              <Row label="Item Name" value={values.itemName   || "Ring"} />
              <Row label="Weight"    value={`${values.grossWeight || "0.000"} g`} />
              <Row label="Purity"    value={values.purity     || "22K"} />
            </div>
          </div>

          {/* Hole area: right 4mm */}
          <div className="flex flex-1 items-center justify-center bg-[#f7f1e6] text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-mocha-700">
            Hole Area
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LabelPreview;
