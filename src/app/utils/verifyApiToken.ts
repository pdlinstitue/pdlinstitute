import { encrypt, decrypt } from "@/app/utils/crypto";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "@/app/utils/token";

// Optional: define return type
interface VerifyResult {
  user: any | null;
  refreshed: boolean;
  newAccessToken: string | null;
}

export async function verifyApiToken(
  encryptedAccess?: string,
  encryptedRefresh?: string
): Promise<VerifyResult> {
  // Attempt to verify access token first
  try {
    if (!encryptedAccess) throw new Error("No access token");

    const decryptedAccess = await decrypt(encryptedAccess);
    const user = await verifyAccessToken(decryptedAccess);

    return { user, refreshed: false, newAccessToken: null };
  } catch (err) {
    // Access token failed, try refresh token
    if (!encryptedRefresh) {
      return { user: null, refreshed: false, newAccessToken: null };
    }

    try {
      const decryptedRefresh = await decrypt(encryptedRefresh);
      const payload = await verifyRefreshToken(decryptedRefresh);

      if (!payload || typeof payload !== "object") {
        return { user: null, refreshed: false, newAccessToken: null };
      }

      const newAccessToken = await generateAccessToken(payload);
      const newEncryptedAccess = await encrypt(newAccessToken);

      return {
        user: payload,
        refreshed: true,
        newAccessToken: newEncryptedAccess,
      };
    } catch (err) {
      return { user: null, refreshed: false, newAccessToken: null };
    }
  }
}