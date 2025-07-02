import React from "react";
import { fetchPaginatedSadhaks } from "./action";
import ActiveSadhakClient from "./ActiveSadhakClient";
import { cookies } from "next/headers";

const ActiveSadhakList = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  const userCookie = cookieStore.get("loggedInUser")?.value || "{}";
  const parsed = JSON.parse(userCookie);

  const initialData = await fetchPaginatedSadhaks(
    1,
    100,
    "",
    accessToken,
    refreshToken,
    parsed.usrRole
  );

  return (
    <ActiveSadhakClient
      initialList={initialData.activeSdkList}
      accessToken={accessToken}
      refreshToken={refreshToken}
      usrRole={parsed.usrRole}
      totalPages={initialData.totalPages}
      currentPage={initialData.currentPage}
      pageSize={100}
    />
  );
};

export default ActiveSadhakList;