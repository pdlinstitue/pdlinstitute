import { BASE_API_URL } from "@/app/utils/constant";

export async function fetchSadhakData(usrRole:any) {
      const res = await fetch(`${BASE_API_URL}/api/users/list?usrRole=${usrRole}`, {
          method: "GET",
          cache: "no-store",
        });

        return await res.json();        
}