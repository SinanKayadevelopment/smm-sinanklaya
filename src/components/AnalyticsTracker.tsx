"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Admin veya API rotalarını sayma
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Aynı sayfa tekrarını engelle
    if (lastTrackedPath.current === currentUrl) {
      return;
    }
    lastTrackedPath.current = currentUrl;

    let visitorId = "";
    try {
      visitorId = localStorage.getItem("ykr_vid") || "";
      if (!visitorId) {
        visitorId =
          "v_" +
          Math.random().toString(36).substring(2, 9) +
          "_" +
          Date.now().toString(36);
        localStorage.setItem("ykr_vid", visitorId);
      }
    } catch {
      // LocalStorage kapalıysa fallback
      visitorId = "anon_" + Date.now().toString(36);
    }

    const payload = JSON.stringify({
      path: pathname,
      visitorId,
      referer: typeof document !== "undefined" ? document.referrer : "",
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      // analytics hatası sessizce yutulur
    }
  }, [pathname, searchParams]);

  return null;
}

