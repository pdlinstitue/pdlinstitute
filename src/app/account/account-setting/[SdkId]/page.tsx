import React from 'react';
import SadhakAccount from './SadhakAccount';
import { BASE_API_URL } from '@/app/utils/constant';

interface IAccountParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const AccountSetting:React.FC<IAccountParams> = async ({params}:IAccountParams) => {

  const { SdkId } = await params;
  let sdkAccountById = null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sadhak data");
    }
    
    const sadhakData  = await res.json();
    sdkAccountById = sadhakData.sdkById;

  } catch (error) {
    console.error("Error fetching sadhak data:", error);
  }

  if (!sdkAccountById) {
    return <div>Failed to load sadhak data.</div>;
  }

  return (
    <div>
      <SadhakAccount sdkAccountById={sdkAccountById} />
    </div>
  );
}

export default AccountSetting
