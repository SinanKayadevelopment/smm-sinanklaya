/**
 * Altyapı Tedarik Servisi (Standart v2 Entegrasyonu)
 * Arka planda siparişlerin güvenli şekilde tedarik hattına iletilmesini sağlar.
 */

interface MtpAddOrderParams {
  serviceId: number;
  link: string;
  quantity: number;
}

interface MtpAddOrderResponse {
  order?: number;
  error?: string;
}

interface MtpStatusResponse {
  charge?: string;
  start_count?: string;
  status?: string;
  remains?: string;
  currency?: string;
  error?: string;
}

export async function sendOrderToProvider(
  apiUrl: string,
  apiKey: string,
  params: MtpAddOrderParams
): Promise<MtpAddOrderResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "add");
    formData.append("service", params.serviceId.toString());
    formData.append("link", params.link);
    formData.append("quantity", params.quantity.toString());

    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      return { error: `HTTP ${res.status}: Tedarik altyapısına ulaşılamadı.` };
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { error: err.message || "Tedarik servisi bağlantı hatası" };
  }
}

export async function getOrderStatusFromProvider(
  apiUrl: string,
  apiKey: string,
  orderId: string
): Promise<MtpStatusResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "status");
    formData.append("order", orderId);

    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      return { error: `HTTP ${res.status}: Durum sorgulanamadı.` };
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { error: err.message || "Durum sorgulama hatası" };
  }
}
