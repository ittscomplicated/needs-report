import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ReportConfirmation() {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ISSUE_ENDPOINT;

  const router = useRouter();
  const { reportId, location, issue } = router.query;
  const { width, height } = useWindowSize();
  const [receiptCode, setReceiptCode] = useState("");
  const [reportCount, setReportCount] = useState(null);



  useEffect(() => {
    async function fetchReportCount() {
      if (location && issue) {
        try {
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({ location, issue }),
          });

          console.log("Sending to API:", JSON.stringify({ location, issue }));


          const data = await response.json();
          if (response.ok) {
            setReportCount(data.issueCount);
            console.log("Received from API:", data.issueCount);

          } else {
            console.error("Failed to get report count:", data.error);
          }
        } catch (error) {
          console.error("Error fetching count:", error);
        }

      }
    }

    if (reportId) {
      setReceiptCode(generateReceiptCode());
      fetchReportCount();
    }
  }, [reportId, location, issue]);
  

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

        {reportCount !== null && (
          <p className="text-sm text-[#064E65] italic">
            {reportCount === 0 ? (
              <>
                You are the <span className="font-semibold">first</span> person
                to report about this in your area.
              </>
            ) : (
              <>
                You are the{" "}
                <span className="font-semibold">#{reportCount + 1}</span> person
                to report about this in your area.
              </>
            )}
          </p>
        )}

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
