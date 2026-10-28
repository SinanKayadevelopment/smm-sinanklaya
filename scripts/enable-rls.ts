import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Supabase veritabanında RLS (Row Level Security) kuralları uygulanıyor...");

  const tables = [
    "Platform",
    "Category",
    "Package",
    "Order",
    "Coupon",
    "Setting",
    "BankAccount",
  ];

  for (const table of tables) {
    console.log(`- ${table} tablosunda RLS aktifleştiriliyor...`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
  }

  // Güvenlik politikaları:
  // Platform, Category ve Package için Data API üzerinden anonim ve yetkili okuma (SELECT) izni tanımla
  console.log("Okuma politikaları (Read policies) ekleniyor...");

  const publicReadTables = ["Platform", "Category", "Package"];
  for (const table of publicReadTables) {
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
              AND tablename = '${table}' 
              AND policyname = 'Public read-only policy for ${table}'
          ) THEN
            CREATE POLICY "Public read-only policy for ${table}"
              ON "${table}"
              FOR SELECT
              TO anon, authenticated
              USING (true);
          END IF;
        END $$;
      `);
      console.log(`✓ ${table}: Genel okuma politikası eklendi.`);
    } catch (e: any) {
      console.warn(`! ${table} politikası:`, e.message);
    }
  }

  // Hassas tablolar (Order, Setting, BankAccount, Coupon) için anonim/dış Data API erişimi tamamen kapalıdır
  // (Prisma süper kullanıcı/postgres rolü ile çalıştığı için RLS'i otomatik bypass eder)

  console.log("\nRLS başarıyla tüm tablolara uygulandı!");
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
