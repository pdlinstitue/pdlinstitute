import React from "react";
import SadhakProfile from "./SadhakProfile";
import { BASE_API_URL } from "@/app/utils/constant";

interface ISadhakParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const ProfileSetting: React.FC<ISadhakParams> = async ({ params }: ISadhakParams) => {

  const { SdkId } = await params;
  let sdkProfileById = null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sadhak data");
    }
    
    const sadhakData  = await res.json();
    sdkProfileById = sadhakData.sdkById;

  } catch (error) {
    console.error("Error fetching sadhak data:", error);
  }

  if (!sdkProfileById) {
    return <div>Failed to load sadhak data.</div>;
  }

  return (
    <div>
      <SadhakProfile sdkProfileById={sdkProfileById} />
    </div>
  );
};

export default ProfileSetting;
