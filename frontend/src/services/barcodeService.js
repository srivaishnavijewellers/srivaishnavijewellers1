import QRCode from "qrcode";

const QR_VERSION = 2;
// PNG raster at a fixed pixel size — identical on every call for the same input,
// no SVG-rasterisation variance between popup windows or print DPI negotiations.
const QR_PIXEL_SIZE = 200;

export const createQrDataUrl = async (value) => {
  return QRCode.toDataURL(value, {
    version: QR_VERSION,
    errorCorrectionLevel: "M",
    width: QR_PIXEL_SIZE,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });
};
