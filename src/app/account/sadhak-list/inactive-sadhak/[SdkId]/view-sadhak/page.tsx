import React from "react";
import { cookies } from "next/headers";
import ViewInactiveSadhak from "./ViewInactiveSadhak";
import { BASE_API_URL } from "@/app/utils/constant";

interface ISadhakParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const ViewInactiveSadhakById: React.FC<ISadhakParams> = async ({ params }: ISadhakParams) => {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { SdkId } = await params;
  let sdkData = null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, 
    {method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`, // ✅ manually pass cookie
      },
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
      <ViewInactiveSadhak sdkData={sdkData} />
    </div>
  );
};

export default ViewInactiveSadhakById;
