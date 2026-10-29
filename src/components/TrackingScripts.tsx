import React from "react";
import Script from "next/script";
import { prisma } from "@/lib/prisma";

export default async function TrackingScripts() {
  let gaId = "";
  let clarityId = "";

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ["GOOGLE_ANALYTICS_ID", "MICROSOFT_CLARITY_ID"] },
      },
    });

    for (const s of settings) {
      if (s.key === "GOOGLE_ANALYTICS_ID" && s.value) {
        gaId = s.value.trim();
      }
      if (s.key === "MICROSOFT_CLARITY_ID" && s.value) {
        clarityId = s.value.trim();
      }
    }
  } catch (e) {
    console.error("TrackingScripts load error:", e);
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Dinamik Microsoft Clarity (Eğer ana layout'taki z5g2hnll19 kodundan farklı bir özel kod girilmişse) */}
      {clarityId && clarityId !== "z5g2hnll19" && (
        <Script id="microsoft-clarity-dynamic" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
