import { QRCodeCanvas } from "qrcode.react";
interface QrCodeProps {
  content: string;
}

const QrCode = ({ content }: QrCodeProps) => {
  return (
    <QRCodeCanvas
      value={content}
      level="H"
      includeMargin
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default QrCode;
