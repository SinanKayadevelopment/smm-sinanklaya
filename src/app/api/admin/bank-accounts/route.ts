import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, accounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Hesaplar alınamadı." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bankName, accountHolder, iban, branchCode } = await request.json();

    if (!bankName || !accountHolder || !iban) {
      return NextResponse.json(
        { success: false, message: "Lütfen banka adı, alıcı adı ve IBAN alanlarını doldurunuz." },
        { status: 400 }
      );
    }

    const account = await prisma.bankAccount.create({
      data: {
        bankName: bankName.trim(),
        accountHolder: accountHolder.trim(),
        iban: iban.trim().toUpperCase(),
        branchCode: branchCode ? branchCode.trim() : null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Banka hesabı başarıyla eklendi.",
      account,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Banka hesabı eklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
