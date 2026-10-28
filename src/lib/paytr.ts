import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface PayTrTokenParams {
  orderCode: string;
  totalAmount: number; // TL cinsinden (Örn: 21.50)
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  packageName: string;
  userIp: string;
  merchantOkUrl?: string;
  merchantFailUrl?: string;
}

export interface PayTrTokenResult {
  status: "success" | "failed";
  token?: string;
  reason?: string;
  isTestMode?: boolean;
}

/**
 * Veritabanından veya çevre değişkenlerinden PayTR bilgilerini çeker.
 */
export async function getPayTrConfig() {
  let merchantId = process.env.PAYTR_MERCHANT_ID || "";
  let merchantKey = process.env.PAYTR_MERCHANT_KEY || "";
  let merchantSalt = process.env.PAYTR_MERCHANT_SALT || "";
  let testPaymentMode = true; // Varsayılan test simülasyon modu

  try {
    const idSetting = await prisma.setting.findUnique({ where: { key: "PAYTR_MERCHANT_ID" } });
    if (idSetting?.value) merchantId = idSetting.value.trim();

    const keySetting = await prisma.setting.findUnique({ where: { key: "PAYTR_MERCHANT_KEY" } });
    if (keySetting?.value) merchantKey = keySetting.value.trim();

    const saltSetting = await prisma.setting.findUnique({ where: { key: "PAYTR_MERCHANT_SALT" } });
    if (saltSetting?.value) merchantSalt = saltSetting.value.trim();

    const modeSetting = await prisma.setting.findUnique({ where: { key: "TEST_PAYMENT_MODE" } });
    if (modeSetting) {
      testPaymentMode = modeSetting.value === "true" || modeSetting.value === "1";
    }
  } catch (err) {
    console.warn("PayTR ayarları veritabanından okunamadı.");
  }

  // Eğer anahtarlar DEMO_ ile başlıyorsa veya eksikse otomatik test modudur
  if (!merchantId || !merchantKey || !merchantSalt || merchantKey.startsWith("DEMO_")) {
    testPaymentMode = true;
  }

  return { merchantId, merchantKey, merchantSalt, testPaymentMode };
}

/**
 * PayTR iFrame Token Oluşturur.
 */
export async function generatePayTrToken(params: PayTrTokenParams): Promise<PayTrTokenResult> {
  const { merchantId, merchantKey, merchantSalt, testPaymentMode } = await getPayTrConfig();

  // Test modu aktifse doğrudan simüle edilmiş test token döner
  if (testPaymentMode) {
    const mockToken = `paytr_test_token_${params.orderCode}_${Date.now()}`;
    return {
      status: "success",
      token: mockToken,
      isTestMode: true,
    };
  }

  try {
    const merchantOid = params.orderCode;
    const email = params.customerEmail;
    const paymentAmount = Math.round(params.totalAmount * 100); // Kuruş cinsinden tamsayı
    const userIp = params.userIp || "127.0.0.1";
    const userName = params.customerName;
    const userAddress = params.customerAddress || "Türkiye";
    const userPhone = params.customerPhone;
    const merchantOkUrl = params.merchantOkUrl || "http://localhost:3000/siparis-sorgula?kod=" + params.orderCode;
    const merchantFailUrl = params.merchantFailUrl || "http://localhost:3000/siparis-sorgula?kod=" + params.orderCode;

    // Sepet Formatı: [[ürün_adı, fiyat, adet]]
    const basket = JSON.stringify([[params.packageName, params.totalAmount.toFixed(2), 1]]);
    const userBasket = Buffer.from(basket).toString("base64");

    const noInstallment = "1";
    const maxInstallment = "0";
    const currency = "TL";
    const testMode = "0"; // 0 Canlı, 1 PayTR Test

    // HMAC SHA256 İmzası
    const hashStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
    const paytrToken = crypto
      .createHmac("sha256", merchantKey)
      .update(hashStr + merchantSalt)
      .digest("base64");

    const formData = new URLSearchParams();
    formData.append("merchant_id", merchantId);
    formData.append("user_ip", userIp);
    formData.append("merchant_oid", merchantOid);
    formData.append("email", email);
    formData.append("payment_amount", paymentAmount.toString());
    formData.append("paytr_token", paytrToken);
    formData.append("user_basket", userBasket);
    formData.append("debug_on", "1");
    formData.append("no_installment", noInstallment);
    formData.append("max_installment", maxInstallment);
    formData.append("user_name", userName);
    formData.append("user_address", userAddress);
    formData.append("user_phone", userPhone);
    formData.append("merchant_ok_url", merchantOkUrl);
    formData.append("merchant_fail_url", merchantFailUrl);
    formData.append("timeout_limit", "30");
    formData.append("currency", currency);
    formData.append("test_mode", testMode);

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      status: "failed",
      reason: error?.message || "PayTR bağlantı hatası.",
    };
  }
}

/**
 * PayTR Webhook Bildirim Hash Doğrulaması.
 */
export async function verifyPayTrWebhook(
  merchantOid: string,
  status: string,
  totalAmount: string,
  incomingHash: string
): Promise<boolean> {
  const { merchantKey, merchantSalt, testPaymentMode } = await getPayTrConfig();

  // Test ortamında simülasyon geçerlidir
  if (testPaymentMode && incomingHash === "TEST_HASH") {
    return true;
  }

  try {
    const hashStr = `${merchantOid}${merchantSalt}${status}${totalAmount}`;
    const calculatedHash = crypto
      .createHmac("sha256", merchantKey)
      .update(hashStr)
      .digest("base64");

    return calculatedHash === incomingHash;
  } catch (e) {
    return false;
  }
}
