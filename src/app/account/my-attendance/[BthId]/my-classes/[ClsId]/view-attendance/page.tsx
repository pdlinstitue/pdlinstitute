"use client";

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";

interface IAtdParams {
  params: Promise<{
    BthId: string;
    ClsId: string;
  }>;
}

const ViewAttdImages: React.FC<IAtdParams> = ({ params }) => {
  const { BthId, ClsId } = use(params);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchScreenshots() {
      try {
        const res = await fetch(
          `/api/attd-screenshots?bthId=${BthId}&clsId=${ClsId}`,
          {
            cache: "no-store",
          }
        );
        const screenshots = await res.json();
        setPreviews(screenshots?.srnshots[0]?.attdSreenShots || []);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchScreenshots();
  }, [BthId, ClsId]);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">View Attendance</h1>
        {isLoading ? (
          <p className="mt-4 text-lg">Loading screenshots...</p>
        ) : previews.length > 0 ? (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  key={index}
                  src={src}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-lg">No screenshots available.</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={()=>router.push(`/account/my-attendance/${BthId}/my-classes`)}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Back
        </button>
      </div>
    </>
  );
};

export default ViewAttdImages;