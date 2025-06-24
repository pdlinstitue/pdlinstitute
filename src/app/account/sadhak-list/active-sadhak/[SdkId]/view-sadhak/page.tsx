import React from "react";
import ViewSadhak from "./ViewSadhak";
import { BASE_API_URL } from "@/app/utils/constant";
import { cookies } from "next/headers";

interface ISadhakParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const ViewSadhakById: React.FC<ISadhakParams> = async ({
  params,
}: ISadhakParams) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { SdkId } = await params;
  let sdkDataById = null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`, // ✅ manually pass cookie
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sadhak data");
    }

    const sadhakData = await res.json();
    sdkDataById = sadhakData.sdkById;
  } catch (error) {
    console.error("Error fetching sadhak data:", error);
  }

  return (
    <div>
      <ViewSadhak sdkData={sdkDataById} />
    </div>
  );
};

export default ViewSadhakById;