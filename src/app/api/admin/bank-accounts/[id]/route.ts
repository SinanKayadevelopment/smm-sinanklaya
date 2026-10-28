import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bankAccount.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Banka hesabı silindi." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Banka hesabı silinemedi." }, { status: 500 });
  }
}
