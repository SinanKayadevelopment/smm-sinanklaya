import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Kupon silindi." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Kupon silinemedi." }, { status: 500 });
  }
}
