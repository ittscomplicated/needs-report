import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ReportConfirmation() {
  const router = useRouter();
  const { reportId } = router.query;
  const { width, height } = useWindowSize();
  const [receiptCode, setReceiptCode] = useState("");

  useEffect(() => {
    if (reportId) {
      setReceiptCode(generateReceiptCode());
    }
  }, [reportId]);

  const handleViewReport = () => {
    if (reportId) {
      router.push(`/map?report=${reportId}`);
    } else {
      router.push("/map");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] text-[#064E65] px-4 relative">
      {width && height && <Confetti width={width} height={height} />}

      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 max-w-md w-full text-center space-y-6 z-10">
        <h1 className="text-3xl md:text-4xl font-bold">Thank You!</h1>
        <p className="text-gray-700">
          Your report has been submitted successfully. Together, we’re making
          the community stronger.
        </p>

        {receiptCode ? (
          <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
            <p className="text-sm text-gray-600">Receipt Number</p>
            <p className="font-mono text-xl text-[#0B4F6C] break-words">
              {receiptCode}
            </p>
          </div>
        ) : (
          <p className="italic text-gray-500 text-sm">Generating receipt...</p>
        )}

        <button
          onClick={handleViewReport}
          className="mt-4 px-6 py-2 bg-[#064E65] text-white rounded-md shadow hover:bg-[#053847] transition"
        >
          View Your Report on Map
        </button>
      </div>
    </div>
  );
}

function generateReceiptCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomPart = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  const timePart = Date.now().toString(36).slice(-2).toUpperCase();

  return `${randomPart}${timePart}`;
}
