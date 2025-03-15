import Crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const enrId = req.nextUrl.searchParams.get("enrId");
  const corId = req.nextUrl.searchParams.get("corId");
  const { order_id, amount, customer_email, customer_phone } = await req.json();

  const merchantId = process.env.CCAVENUE_MERCHANT_ID || "";
  const accessCode = process.env.CCAVENUE_ACCESS_CODE || "";
  const workingKey = process.env.CCAVENUE_WORKING_KEY || "";

  const redirectUrl = encodeURIComponent(`http://www.localhost:3000/my-courses/${corId}/enroll-course/${enrId}/payment-success`);
  const cancelUrl = encodeURIComponent(`http://www.localhost:3000/my-courses/${corId}/enroll-course/${enrId}/payment-failed`);

  // 🔹 Construct the request string
  const data = `merchant_id=${merchantId}&order_id=${order_id}&currency=INR&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&billing_email=${customer_email}&billing_tel=${customer_phone}`;

  const IV = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); // Correct IV format

  // Generate 32-byte key using MD5 hash (as in the provided function)
  const key = Crypto.createHash("md5").update(workingKey).digest();
  
  // Validate key length
  if (key.length !== 16) {
    throw new Error("Invalid derived key length. It must be 16 bytes for AES-128-CBC.");
  }
  
  // 🔹 Encryption function with proper key formatting
  const encrypt = (plainText: string): string => {
    const cipher = Crypto.createCipheriv("aes-128-cbc", key, IV);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };  

  const encryptedData = encrypt(data);

  return NextResponse.json({ encryptedData, accessCode });
}
