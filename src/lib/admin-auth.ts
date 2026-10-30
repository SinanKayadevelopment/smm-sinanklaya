const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "AdminSecretKey_YayinciKral_2026_SecureJwtAuth_ProductionReady!";

export const ADMIN_USERNAME = "58672205858";
export const ADMIN_PASSWORD = "Ceren.76";
export const ADMIN_COOKIE_NAME = "yk_admin_token";

export interface AdminSession {
  username: string;
  role: "admin";
  exp: number;
}

/**
 * Web Crypto API kullanarak HMAC-SHA256 anahtarı türetir (Edge Runtime ve Node.js 18+ tam uyumlu)
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof buffer === "string") {
    bytes = new TextEncoder().encode(buffer);
  } else if (buffer instanceof Uint8Array) {
    bytes = buffer;
  } else {
    bytes = new Uint8Array(buffer);
  }

  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Edge & Node uyumlu Web Crypto API JWT üretici
 */
export async function signAdminToken(username: string): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 gün geçerli
  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      role: "admin",
      exp,
    })
  );

  const dataToSign = new TextEncoder().encode(`${header}.${payload}`);
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, dataToSign);
  const signature = base64UrlEncode(signatureBuffer);

  return `${header}.${payload}.${signature}`;
}

/**
 * Edge & Node uyumlu Web Crypto API Token doğrulaması
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  try {
    const dataToVerify = new TextEncoder().encode(`${header}.${payload}`);
    const key = await getCryptoKey();

    // İmza bytes'ını çöz
    let sigBase64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) sigBase64 += "=";
    const binary = atob(sigBase64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, dataToVerify);
    if (!isValid) return null;

    const decoded = JSON.parse(base64UrlDecode(payload)) as AdminSession;
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null;
    }

    if (decoded.username !== ADMIN_USERNAME) {
      return null;
    }

    return decoded;
  } catch (err) {
    return null;
  }
}
