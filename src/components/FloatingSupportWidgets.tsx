"use client";

import React, { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import OrderLookupModal from "./OrderLookupModal";

export default function FloatingSupportWidgets() {
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <>
      {/* Sol Alt: Hızlı Sipariş Sorgulama Butonu (Screenshot 2'deki Sol Büyüteç Butonu) */}
      <button
        type="button"
        onClick={() => setIsLookupOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-white text-[#1E1B4B] shadow-2xl border border-[#EDE9FE] flex items-center justify-center hover:scale-110 hover:border-[#7C1CF5] transition-all group cursor-pointer"
        aria-label="Sipariş Sorgula"
      >
        <Search className="w-5 h-5 text-[#7C1CF5] group-hover:scale-110 transition-transform" />
      </button>

      {/* Sağ Alt: Botcubey Canlı Destek & WhatsApp Widget'ı (Screenshot 1 & 2) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2">
        <div className="hidden sm:block bg-white text-[#1E1B4B] px-3.5 py-2 rounded-2xl shadow-xl text-xs font-bold border border-[#EDE9FE] animate-bounce">
          Merhaba! Size nasıl yardımcı olabilirim?
        </div>
        <a
          href="https://wa.me/905331948396"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-[#7C1CF5] hover:bg-[#6005BA] shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-pulse"></span>
          <span>Çevrim içi</span>
          <span className="ml-1 w-5 h-5 rounded-full bg-white text-[#7C1CF5] text-[10px] font-black flex items-center justify-center">
            1
          </span>
        </a>
      </div>

      <OrderLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} />
    </>
  );
}
