import { prisma } from "@/lib/prisma";

export interface MtpOrderCreateResult {
  order?: number | string;
  error?: string;
}

export interface MtpOrderStatusResult {
  charge?: string;
  start_count?: string;
  status?: "Completed" | "In progress" | "Pending" | "Processing" | "Partial" | "Canceled" | string;
  remains?: string;
  currency?: string;
  error?: string;
}

export interface MtpServiceItem {
  service: number | string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

export interface MtpBalanceResult {
  balance?: string;
  currency?: string;
  error?: string;
}

/**
 * Veritabanından veya çevre değişkenlerinden altyapı tedarik ayarlarını çeker.
 */
async function getProviderConfig() {
  let apiUrl = process.env.MTP_API_URL || "https://morethanpanel.com/api/v2";
  let apiKey = process.env.MTP_API_KEY || "";

  try {
    const dbUrlSetting = await prisma.setting.findUnique({
      where: { key: "MTP_API_URL" },
    });
    if (dbUrlSetting?.value) apiUrl = dbUrlSetting.value.trim();

    const dbKeySetting = await prisma.setting.findUnique({
      where: { key: "MTP_API_KEY" },
    });
    if (dbKeySetting?.value) apiKey = dbKeySetting.value.trim();
  } catch (err) {
    console.warn("Setting tablosundan tedarikçi ayarları okunamadı, varsayılanlar kullanılıyor.");
  }

  return { apiUrl, apiKey };
}

/**
 * 1. Yeni Tedarik Siparişi Oluşturma
 * Action: 'add'
 */
export async function createProviderOrder(
  serviceId: number,
  link: string,
  quantity: number
): Promise<MtpOrderCreateResult> {
  const { apiUrl, apiKey } = await getProviderConfig();

  // Test veya demo anahtarı kontrolü
  if (!apiKey || apiKey.startsWith("DEMO_") || apiKey === "DEMO_KEY") {
    // Geliştirme ve test ortamında stabil simülasyon sipariş ID'si üret
    const mockOrderId = Math.floor(10000000 + Math.random() * 90000000);
    return { order: mockOrderId };
  }

  try {
    // Servis bazlı minimum miktar koruması (örn. Kick canlı izleyicide min 10 iken 5 izleyici siparişini güvenle 10'a yükselt)
    const sendQuantity = (serviceId === 6114 && quantity < 10) ? 10 : quantity;

    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "add");
    formData.append("service", serviceId.toString());
    formData.append("link", link);
    formData.append("quantity", sendQuantity.toString());

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        error: `Tedarik API sunucusundan HTTP ${response.status} hatası alındı.`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      error: error?.message || "Tedarik altyapısına bağlanırken beklenmeyen bir hata oluştu.",
    };
  }
}

/**
 * 2. Tedarik Sipariş Durumunu Sorgulama
 * Action: 'status'
 */
export async function getProviderOrderStatus(
  providerOrderId: string
): Promise<MtpOrderStatusResult> {
  const { apiUrl, apiKey } = await getProviderConfig();

  // Test modu simülasyonu
  if (!apiKey || apiKey.startsWith("DEMO_") || apiKey === "DEMO_KEY" || providerOrderId.startsWith("MTP-")) {
    return {
      charge: "0.25",
      start_count: "100",
      status: "In progress",
      remains: "0",
      currency: "USD",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "status");
    formData.append("order", providerOrderId);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        error: `Tedarik API durum sorgulama HTTP ${response.status} hatası.`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      error: error?.message || "Durum sorgulama esnasında bağlantı hatası oluştu.",
    };
  }
}

/**
 * 3. Tedarikçi Servis Listesini Çekme
 * Action: 'services'
 */
export async function getProviderServices(): Promise<MtpServiceItem[] | { error: string }> {
  const { apiUrl, apiKey } = await getProviderConfig();

  if (!apiKey || apiKey.startsWith("DEMO_")) {
    return [
      {
        service: 101,
        name: "Twitch 1 Saatlik Canlı İzleyici [Anlık - Stabil]",
        type: "Default",
        category: "Twitch Canlı İzleyici",
        rate: "0.85",
        min: "25",
        max: "10000",
      },
      {
        service: 201,
        name: "Kick Haftalık Canlı İzleyici [Otomatik Başlangıç]",
        type: "Default",
        category: "Kick Canlı İzleyici",
        rate: "6.20",
        min: "25",
        max: "5000",
      },
    ];
  }

  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "services");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      return { error: `Servis listesi alınamadı (HTTP ${response.status})` };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { error: error?.message || "Servis listesi çekme hatası." };
  }
}

/**
 * 4. Tedarikçi Kalan USD Bakiyesini Çekme
 * Action: 'balance'
 */
export async function getProviderBalance(): Promise<MtpBalanceResult> {
  const { apiUrl, apiKey } = await getProviderConfig();

  if (!apiKey || apiKey.startsWith("DEMO_")) {
    return { balance: "148.50", currency: "USD" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "balance");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      return { error: `Bakiye sorgulanamadı (HTTP ${response.status})` };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { error: error?.message || "Bakiye kontrol hatası." };
  }
}
