import QRCode from "qrcode";

export const createQrDataUrl = async (value) =>
  QRCode.toDataURL(value, {
    width: 200,
    margin: 0,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });
