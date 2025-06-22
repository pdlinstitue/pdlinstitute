const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const rawKeyBytes = base64ToBytes(process.env.ENCRYPTION_KEY || "");

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    rawKeyBytes,
    "AES-CBC",
    false,
    ["encrypt", "decrypt"]
  );
}

const IV_LENGTH = 16;

export async function encrypt(text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKey();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encoder.encode(text)
  );

  const encryptedBytes = new Uint8Array(iv.length + encrypted.byteLength);
  encryptedBytes.set(iv, 0);
  encryptedBytes.set(new Uint8Array(encrypted), iv.length);
  const encryptedBase64 = btoa(
    String.fromCharCode.apply(null, Array.from(encryptedBytes))
  );
  return encryptedBase64;
}

export async function decrypt(encryptedText: string): Promise<string> {
  const encryptedBuffer = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const data = encryptedBuffer.slice(IV_LENGTH);

  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    data
  );

  return decoder.decode(decrypted);
}