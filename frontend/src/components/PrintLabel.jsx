import { createQrDataUrl } from "../services/barcodeService.js";
import { printLabelRequest } from "../services/stockService.js";

const buildLabelMarkup = (label) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Jewellery Tag</title>
    <style>
      @page { size: 9mm 10mm; margin: 0; }
      * { box-sizing: border-box; }
      html, body {
        margin: 0; padding: 0;
        width: 9mm; height: 10mm;
        overflow: hidden;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .label     { display: flex; width: 9mm; height: 10mm; }
      .printable { display: flex; width: 5mm; height: 10mm; }
      .qr        { display: flex; align-items: center; justify-content: center;
                   width: 2.5mm; height: 10mm; overflow: hidden; }
      .qr img    { display: block; width: 2.4mm; height: 2.4mm;
                   image-rendering: pixelated; }
      .meta      { display: flex; flex-direction: column; justify-content: center;
                   gap: 0.15mm; width: 2.5mm; height: 10mm;
                   padding: 0.1mm 0.15mm; overflow: hidden; }
      .row       { display: flex; align-items: baseline; white-space: nowrap; }
      .lbl       { font-size: 0.75mm; color: #555; }
      .sep       { font-size: 0.75mm; color: #555; margin: 0 0.05mm; }
      .val       { font-size: 1mm; font-weight: 700; color: #000; }
      .blank     { width: 4mm; height: 10mm; }
    </style>
  </head>
  <body>
    <div class="label">
      <div class="printable">
        <div class="qr">
          <img src="${label.qrDataUrl}" alt="" />
        </div>
        <div class="meta">
          <div class="row">
            <span class="lbl">Item No</span><span class="sep">:</span>
            <span class="val">${label.itemNumber || ""}</span>
          </div>
          <div class="row">
            <span class="lbl">Item Name</span><span class="sep">:</span>
            <span class="val">${label.itemName || ""}</span>
          </div>
          <div class="row">
            <span class="lbl">Weight</span><span class="sep">:</span>
            <span class="val">${label.grossWeight || ""} g</span>
          </div>
          <div class="row">
            <span class="lbl">Purity</span><span class="sep">:</span>
            <span class="val">${label.purity || ""}</span>
          </div>
        </div>
      </div>
      <div class="blank"></div>
    </div>
  </body>
</html>
`;

export const printStockLabel = async (payload) => {
  const { label } = await printLabelRequest(payload);
  const qrDataUrl = await createQrDataUrl(label.barcode || label.itemNumber || "");

  const printWindow = window.open("", "_blank", "width=600,height=400");
  if (!printWindow) {
    throw new Error("Unable to open print window. Please allow popups for this site.");
  }

  printWindow.document.open();
  printWindow.document.write(buildLabelMarkup({ ...label, qrDataUrl }));
  printWindow.document.close();

  // Wait for the browser to fully render the written content before printing
  await new Promise((resolve) => setTimeout(resolve, 600));

  printWindow.focus();
  printWindow.print();
  printWindow.onafterprint = () => printWindow.close();

  return label;
};
