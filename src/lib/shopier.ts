import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface ShopierConfig {
  apiKey: string;
  apiSecret: string;
  websiteIndex: number;
}

export interface ShopierPaymentParams {
  orderCode: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  billingAddress?: string;
  billingCity?: string;
}

export interface ShopierFormFields {
  API_key: string;
  website_index: number;
  platform_order_id: string;
  product_name: string;
  product_type: number; // 1 - Dijital/İndirilebilir
  buyer_name: string;
  buyer_surname: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_account_age: number; // 0
  buyer_id_nr: number; // 0
  billing_address: string;
  billing_city: string;
  billing_country: string; // TR
  billing_postcode: string; // 34000
  shipping_address: string;
  shipping_city: string;
  shipping_country: string; // TR
  shipping_postcode: string; // 34000
  total_order_value: string;
  currency: number; // 0 - TL
  platform: number; // 0
  is_in_frame: number; // 0
  current_language: number; // 0 - TR
  modul_version: string; // 1.0.4
  random_nr: number;
  signature: string;
}

/**
 * Türkçe karakterleri Shopier API uyumlu ASCII formatına dönüştürür.
 * (Shopier api_pay4.php Türkçe karakterlerde 509 hatası verebilmektedir)
 */
function toAscii(str: string): string {
  if (!str) return "";
  return str
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/[^a-zA-Z0-9\s.,\-_]/g, "");
}

/**
 * Shopier için telefon numarasını ulusal formatta (05XXXXXXXXX, 11 hane) temizler.
 */
function cleanPhoneNumber(phone: string): string {
  let digits = (phone || "").replace(/[^0-9]/g, "");
  if (digits.startsWith("90") && digits.length === 12) {
    digits = digits.substring(2);
  }
  if (!digits.startsWith("0")) {
    digits = "0" + digits;
  }
  if (digits.length > 11) {
    digits = digits.slice(-11);
  }
  if (digits.length < 11) {
    digits = "05331948396";
  }
  return digits;
}

/**
 * Shopier 509 hatasını önlemek için e-posta adresini ASCII ve geçerli e-posta formatına zorlar.
 */
function cleanEmail(email: string): string {
  const ascii = toAscii(email || "").replace(/\s+/g, "").toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (emailRegex.test(ascii)) {
    return ascii;
  }
  return "musteri@yayincikral.com";
}

/**
 * Veritabanından veya ortam değişkenlerinden Shopier API ayarlarını çeker.
 */
export async function getShopierConfig(): Promise<ShopierConfig> {
  let apiKey = process.env.SHOPIER_API_KEY || "";
  let apiSecret = process.env.SHOPIER_API_SECRET || "";
  let websiteIndex = 1;

  try {
    const keySetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_API_KEY" } });
    if (keySetting?.value) apiKey = keySetting.value.trim();

    const secretSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_API_SECRET" } });
    if (secretSetting?.value) apiSecret = secretSetting.value.trim();

    const indexSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_WEBSITE_INDEX" } });
    if (indexSetting?.value) {
      const parsed = parseInt(indexSetting.value.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) websiteIndex = parsed;
    }
  } catch (err) {
    console.warn("Shopier ayarları veritabanından okunamadı:", err);
  }

  return { apiKey, apiSecret, websiteIndex };
}

/**
 * Shopier api_pay4.php için gerekli tüm POST parametrelerini ve HMAC-SHA256 imzasını oluşturur.
 */
export async function generateShopierPayment(params: ShopierPaymentParams): Promise<{
  actionUrl: string;
  fields: ShopierFormFields;
  htmlForm: string;
}> {
  const config = await getShopierConfig();

  // İsim ve soyismi ayır & ASCII temizliği yap
  const nameParts = (params.customerName || "Degerli Musteri").trim().split(" ");
  const rawBuyerName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];
  const rawBuyerSurname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Kullanici";

  const buyer_name = toAscii(rawBuyerName).trim() || "Musteri";
  const buyer_surname = toAscii(rawBuyerSurname).trim() || "Kullanici";
  const product_name = toAscii(params.packageName).trim() || "Hizmet Paketi";

  const cleanPhone = cleanPhoneNumber(params.customerPhone);

  const billing_address = toAscii(params.billingAddress || "Turkiye").trim() || "Turkiye";
  const billing_city = toAscii(params.billingCity || "Istanbul").trim() || "Istanbul";

  // 6 haneli rastgele sayı
  const random_nr = Math.floor(100000 + Math.random() * 900000);
  const platform_order_id = params.orderCode;
  const total_order_value = params.totalAmount.toFixed(2);
  const currency = 0; // 0 = TL

  // İmza (Signature) Hesaplama:
  // random_nr + platform_order_id + total_order_value + currency
  // API_secret ile HMAC-SHA256 şifrele ve base64'e dönüştür.
  const dataToSign = `${random_nr}${platform_order_id}${total_order_value}${currency}`;
  const signature = crypto
    .createHmac("sha256", config.apiSecret)
    .update(dataToSign)
    .digest("base64");

  if (!config.apiKey || !config.apiSecret) {
    throw new Error(
      "Shopier API anahtarları henüz tanımlanmamıştır. Lütfen Yönetim Paneli > Sistem & Ödeme Ayarları sayfasından API Key ve API Secret bilgilerinizi kaydediniz."
    );
  }

  const cleanBuyerEmail = cleanEmail(params.customerEmail);
  const safeAddress = billing_address.length < 5 ? "Turkiye Istanbul Merkez" : billing_address;

  const fields: ShopierFormFields = {
    API_key: config.apiKey,
    website_index: config.websiteIndex || 1,
    platform_order_id,
    product_name: product_name.substring(0, 100),
    product_type: 1, // 1 - Dijital/İndirilebilir
    buyer_name: buyer_name.substring(0, 50),
    buyer_surname: buyer_surname.substring(0, 50),
    buyer_email: cleanBuyerEmail.substring(0, 100),
    buyer_phone: cleanPhone, // Başında 0 olan 11 haneli ulusal format
    buyer_account_age: 1,
    buyer_id_nr: 1,
    billing_address: safeAddress.substring(0, 255),
    billing_city: billing_city.substring(0, 50),
    billing_country: "TR",
    billing_postcode: "34000",
    shipping_address: safeAddress.substring(0, 255),
    shipping_city: billing_city.substring(0, 50),
    shipping_country: "TR",
    shipping_postcode: "34000",
    total_order_value,
    currency,
    platform: 0,
    is_in_frame: 0,
    current_language: 0, // 0 - TR
    modul_version: "1.0.4",
    random_nr,
    signature,
  };

  const actionUrl = "https://www.shopier.com/ShowProduct/api_pay4.php";

  // Otomatik submit olan gizli HTML form
  const inputElements = Object.entries(fields)
    .map(([key, val]) => `    <input type="hidden" name="${key}" value="${escapeHtml(String(val))}" />`)
    .join("\n");

  const htmlForm = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shopier Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz...</title>
  <style>
    body {
      background-color: #0F172A;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background-color: #1E293B;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(145, 70, 255, 0.2);
      border-top-color: #9146FF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h2 {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 8px;
      color: #FFFFFF;
    }
    p {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .btn {
      background: linear-gradient(135deg, #7C1CF5 0%, #9146FF 100%);
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }
    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body onload="document.getElementById('shopier_auto_form').submit();">
  <div class="card">
    <div class="spinner"></div>
    <h2>Shopier 3D Secure Bağlantısı</h2>
    <p>Güvenli ödeme sayfasına aktarılıyorsunuz. Lütfen sayfayı kapatmayınız...</p>
    <form id="shopier_auto_form" method="POST" action="${actionUrl}">
${inputElements}
      <noscript>
        <button type="submit" class="btn">Ödemeye Devam Et</button>
      </noscript>
    </form>
  </div>
</body>
</html>`;

  return { actionUrl, fields, htmlForm };
}

/**
 * Shopier Geri Dönüş (Callback / Webhook) İmza Doğrulaması
 * İmza: random_nr + platform_order_id değerini API_secret ile HMAC-SHA256'dan geçir
 */
export async function verifyShopierWebhookSignature(
  random_nr: string,
  platform_order_id: string,
  receivedSignature: string
): Promise<boolean> {
  const config = await getShopierConfig();

  // Test veya demo anahtarı kontrolü
  if (!config.apiSecret || config.apiSecret === "DEMO_SHOPIER_SECRET") {
    console.warn("Shopier API Secret yapılandırılmamış, test kabul ediliyor.");
    return true;
  }

  try {
    const dataToVerify = `${random_nr}${platform_order_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", config.apiSecret)
      .update(dataToVerify)
      .digest("base64");

    return expectedSignature === receivedSignature;
  } catch (error) {
    console.error("Shopier imza doğrulama hatası:", error);
    return false;
  }
}

/**
 * Shopier OSB (Otomatik Sipariş Bildirimi) Hash Doğrulaması:
 * PHP Karşılığı: hash_hmac('sha256', $_POST['res'] . $username, $key, false)
 */
export async function verifyShopierOsbHash(res: string, incomingHash: string): Promise<boolean> {
  const config = await getShopierConfig();
  const username = config.apiKey || "21cb1a38edac99d3e4b2e1c0c43f02e4";
  const key = config.apiSecret || "07b8c8931dd1504f51e4711754ebe8f7";

  try {
    const computedHash = crypto
      .createHmac("sha256", key)
      .update(res + username)
      .digest("hex");

    return computedHash.toLowerCase() === (incomingHash || "").trim().toLowerCase();
  } catch (err) {
    console.error("Shopier OSB hash doğrulama hatası:", err);
    return false;
  }
}

/**
 * Shopier OSB Base64 Verisini JSON olarak ayrıştırır
 */
export function decodeShopierOsbPayload(res: string): any {
  try {
    const decoded = Buffer.from(res, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (err) {
    console.error("Shopier OSB payload decode hatası:", err);
    return null;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
