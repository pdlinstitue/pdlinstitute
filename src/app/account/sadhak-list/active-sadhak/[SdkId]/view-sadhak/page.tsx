import React from "react";
import ViewSadhak from "./ViewSadhak";
import { BASE_API_URL } from "@/app/utils/constant";

interface ISadhakParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const ViewSadhakById: React.FC<ISadhakParams> = async ({ params }: ISadhakParams) => {

  const { SdkId } = await params;
  let sdkData = null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sadhak data");
    }
    
    const sadhakData  = await res.json();
    sdkData = sadhakData.sdkById;

  } catch (error) {
    console.error("Error fetching sadhak data:", error);
  }

  if (!sdkData) {
    return <div>Failed to load sadhak data.</div>;
  }

  return (
    <div>
      <ViewSadhak sdkData={sdkData} />
    </div>
  );
};

export default ViewSadhakById;
