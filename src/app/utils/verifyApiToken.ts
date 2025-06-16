import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/app/utils/crypto";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "@/app/utils/token";

export async function verifyApiToken() {
  const cookieStore = await cookies();
  const encryptedAccess = cookieStore.get("accessToken")?.value;
  const encryptedRefresh = cookieStore.get("refreshToken")?.value;

  // try {
  //   if (!encryptedAccess) throw new Error("No access token");
  //   const decryptedAccess = decrypt(encryptedAccess);
  //   const user = verifyAccessToken(decryptedAccess);
  //   return { user, refreshed: false };
  // } catch (err) {
  //   if (!encryptedRefresh) return { user: null, refreshed: false };

  //   try {
  //     const decryptedRefresh = decrypt(encryptedRefresh);
  //     const payload = verifyRefreshToken(decryptedRefresh);

  //     if (typeof payload !== "object" || payload === null) {
  //       return { user: null, refreshed: false };
  //     }

  //     const newAccessToken = generateAccessToken(payload as object);
  //     const newEncryptedAccess = encrypt(newAccessToken);

  //     cookieStore.set("accessToken", newEncryptedAccess, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //       path: "/",
  //       maxAge: 60 * 15,
  //     });

  //     return { user: payload, refreshed: true };
  //   } catch {
  //     return { user: null, refreshed: false };
  //   }
  //}
}