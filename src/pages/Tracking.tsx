import { useSearchParams } from "react-router-dom";
import BusMap from "../components/BusMap";
import { useState } from "react";

export default function Tracking() {
  const [search] = useSearchParams();
  const busId = search.get("bus") || undefined;
  const [infoVisible, setInfoVisible] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          {busId ? `Tracking Bus ${busId}` : "Live Bus Tracking"}
        </h1>
        <BusMap busId={busId || undefined} />

        {busId && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setInfoVisible(!infoVisible)}
              className="text-sm text-[#FF6B00] hover:underline"
            >
              {infoVisible ? "Hide" : "Show"} tracking info
            </button>
            {infoVisible && (
              <p className="mt-2 text-gray-600">
                Your bus will appear on the map above and update every few
                seconds. Stay on this page to monitor its progress.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
