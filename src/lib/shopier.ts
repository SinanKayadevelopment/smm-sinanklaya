import { prisma } from "@/lib/prisma";
import { ShopierApiClient, ShopierPaymentFlow, verifyOsb, parseOsbPayload } from "@nopeion/shopier";

export interface ShopierConfig {
  pat: string;
  shopSlug: string;
  osbUsername?: string;
  osbPassword?: string;
}

export interface CreateShopierPaymentParams {
  orderCode: string;
  totalAmount: number;
  packageTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  imageUrl?: string;
}

export interface ShopierPaymentResult {
  productId: string;
  paymentUrl: string;
  checkoutHtml: string;
  hostedCheckoutHtml: string;
}

/**
 * Veritabanından veya ortam değişkenlerinden Shopier REST API v1 ayarlarını çeker.
 */
export async function getShopierConfig(): Promise<ShopierConfig> {
  let pat = process.env.SHOPIER_PAT || "";
  let shopSlug = process.env.SHOPIER_SHOP_SLUG || "yayincikral";
  let osbUsername = process.env.SHOPIER_OSB_USERNAME || "";
  let osbPassword = process.env.SHOPIER_OSB_PASSWORD || "";

  try {
    const patSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_PAT" } });
    if (patSetting?.value) pat = patSetting.value.trim();

    const slugSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_SHOP_SLUG" } });
    if (slugSetting?.value) shopSlug = slugSetting.value.trim();

    const osbUserSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_OSB_USERNAME" } });
    if (osbUserSetting?.value) osbUsername = osbUserSetting.value.trim();

    const osbPassSetting = await prisma.setting.findUnique({ where: { key: "SHOPIER_OSB_PASSWORD" } });
    if (osbPassSetting?.value) osbPassword = osbPassSetting.value.trim();
  } catch (err) {
    console.warn("Shopier ayarları veritabanından okunamadı:", err);
  }

  return { pat, shopSlug, osbUsername, osbPassword };
}

/**
 * ShopierApiClient instance döndürür
 */
export async function getShopierClient(): Promise<ShopierApiClient> {
  const config = await getShopierConfig();
  if (!config.pat) {
    throw new Error(
      "Shopier Kişisel Erişim Anahtarı (PAT) bulunamadı. Lütfen /admin/settings sayfasından kaydediniz."
    );
  }
  return new ShopierApiClient({ pat: config.pat });
}

/**
 * Shopier REST API v1 (@nopeion/shopier) kullanarak ödeme linki ve Hosted Checkout formu oluşturur.
 */
export async function createShopierPayment(params: CreateShopierPaymentParams): Promise<ShopierPaymentResult> {
  const config = await getShopierConfig();
  if (!config.pat) {
    throw new Error(
      "Shopier PAT anahtarı henüz tanımlanmamıştır. Lütfen Yönetim Paneli > Sistem & Ödeme Ayarları sayfasından kaydediniz."
    );
  }

  const client = new ShopierApiClient({ pat: config.pat });
  const payments = new ShopierPaymentFlow({
    client,
    shopSlug: config.shopSlug || "yayincikral",
  });

  const formattedAmount = Number(params.totalAmount).toFixed(2);
  const title = `${params.packageTitle} - Sipariş #${params.orderCode}`;

  const payment = await payments.createPaymentLink({
    title: title.substring(0, 100),
    amount: formattedAmount,
    currency: "TRY",
    imageUrl:
      params.imageUrl ||
      "https://placehold.co/600x600/1e1b4b/ffffff.png?text=Dijital+Paket",
    orderId: params.orderCode,
    customListing: false,
    hostedCheckout: false,
    shopSlug: config.shopSlug || "yayincikral",
  });

  // Ürün oluşturuldu, productId'yi siparişle eşleştirmek için döndür
  return {
    productId: payment.productId,
    paymentUrl: payment.paymentUrl,
    checkoutHtml: payment.checkoutHtml || payment.hostedCheckoutHtml || "",
    hostedCheckoutHtml: payment.hostedCheckoutHtml || payment.checkoutHtml || "",
  };
}

/**
 * Geçici oluşturulan Shopier ürününü temizler
 */
export async function deleteShopierProduct(productId: string): Promise<boolean> {
  if (!productId) return false;
  try {
    const client = await getShopierClient();
    await client.deleteProduct(productId);
    console.log(`Shopier ürünü (#${productId}) başarıyla silindi.`);
    return true;
  } catch (err: any) {
    console.warn(`Shopier ürün (#${productId}) silinirken hata:`, err?.message || err);
    return false;
  }
}

/**
 * Shopier OSB (Otomatik Sipariş Bildirimi) verisini doğrular
 */
export async function verifyShopierOsb(res: string, hash: string): Promise<boolean> {
  const config = await getShopierConfig();
  const username = config.osbUsername || "21cb1a38edac99d3e4b2e1c0c43f02e4";
  const password = config.osbPassword || "07b8c8931dd1504f51e4711754ebe8f7";

  try {
    const result = verifyOsb({
      username,
      password,
      res,
      hash,
    });
    return result.verified;
  } catch (err) {
    console.error("Shopier OSB doğrulama hatası:", err);
    return false;
  }
}

/**
 * Shopier OSB içeriğini çözer
 */
export function decodeShopierOsb(res: string) {
  try {
    return parseOsbPayload(res);
  } catch (err) {
    console.error("Shopier OSB parse hatası:", err);
    return null;
  }
}
