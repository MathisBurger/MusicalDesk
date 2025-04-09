import BwipJs from "bwip-js/browser";
import { useEffect, useRef } from "react";
interface AztecCodeProps {
  content: string;
}

const AztecCode = ({ content }: AztecCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        BwipJs.toCanvas(canvasRef.current, {
          bcid: "azteccode",
          text: content,
          scale: 3,
          backgroundcolor: "FFFFFF",
        });
      } catch (e) {
        console.error("Error generating Aztec code:", e);
      }
    }
  }, [content]);

  return <canvas ref={canvasRef} />;
};

export default AztecCode;
