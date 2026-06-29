import { useEffect, useState } from "react";
import { createQrDataUrl } from "../services/barcodeService.js";

const BarcodePreview = ({ barcode, itemNumber }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let ignore = false;

    const generate = async () => {
      if (!barcode && !itemNumber) {
        setSrc("");
        return;
      }

      const dataUrl = await createQrDataUrl(barcode || itemNumber);
      if (!ignore) {
        setSrc(dataUrl);
      }
    };

    generate();
    return () => {
      ignore = true;
    };
  }, [barcode, itemNumber]);

  return src ? (
    <img src={src} alt="Barcode QR Preview" className="h-full w-full object-contain" />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[10px] text-mocha-700">
      Generate barcode
    </div>
  );
};

export default BarcodePreview;

