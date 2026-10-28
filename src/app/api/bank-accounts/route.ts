import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, bankAccounts });
  } catch (error: any) {
    console.error("Banka hesapları getirme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Banka hesapları yüklenemedi." },
      { status: 500 }
    );
  }
}
