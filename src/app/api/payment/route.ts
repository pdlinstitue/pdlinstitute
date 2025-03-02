import Crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest, res:NextResponse) {

  const { order_id, amount, customer_email, customer_phone } = await req.json();
  
  const merchantId = process.env.CCAVENUE_MERCHANT_ID;
  const accessCode = process.env.CCAVENUE_ACCESS_CODE;
  const workingKey = process.env.CCAVENUE_WORKING_KEY;
  const redirectUrl = "http://localhost:3000/payment-success"; // Update with your success URL
  const cancelUrl = "http://localhost:3000/payment-failed"; // Update with your failure URL

  const data = `merchant_id=${merchantId}&order_id=${order_id}&currency=INR&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&billing_email=${customer_email}&billing_tel=${customer_phone}`;

  const encrypt = (plainText: string, key: string) => {
    const cipher = Crypto.createCipheriv("aes-128-cbc", key, key);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };

  if (!workingKey) {
    throw new Error("CCAVENUE_WORKING_KEY is not defined");
  }

  const encryptedData = encrypt(data, workingKey);
  return NextResponse.json({encryptedData, accessCode});
}
