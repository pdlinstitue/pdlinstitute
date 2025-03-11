import Crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const enrId = req.nextUrl.searchParams.get("enrId");
  const corId = req.nextUrl.searchParams.get("corId");
  const { order_id, amount, customer_email, customer_phone } = await req.json();

  const merchantId = process.env.CCAVENUE_MERCHANT_ID;
  const accessCode = process.env.CCAVENUE_ACCESS_CODE;
  const workingKey = process.env.CCAVENUE_WORKING_KEY?.substring(0,16);

  if (!workingKey) {
    throw new Error("CCAVENUE_WORKING_KEY is not defined");
  }

  const redirectUrl = encodeURIComponent(`http://www.localhost:3000/my-courses/${corId}/enroll-course/${enrId}/payment-success`);
  const cancelUrl = encodeURIComponent(`http://www.localhost:3000/my-courses/${corId}/enroll-course/${enrId}/payment-failed`);

  // 🔹 Construct the request string
  const data = `merchant_id=${merchantId}&order_id=${order_id}&currency=INR&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&billing_email=${customer_email}&billing_tel=${customer_phone}`;

  // 🔹 Encryption function with proper key formatting
  const encrypt = (plainText: string, key: string) => {
    const keyHash = Crypto.createHash("md5").update(key).digest("hex"); // Ensure 16-byte key
    const formattedKey = Buffer.from(keyHash, "hex").subarray(0, 16); // Convert to 16-byte key buffer
    const iv = Buffer.alloc(16, 0); // AES-128-CBC requires 16-byte IV (zeroed out)

    const cipher = Crypto.createCipheriv("aes-128-cbc", formattedKey, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  };

  const encryptedData = encrypt(data, workingKey);

  return NextResponse.json({ encryptedData, accessCode });
}
