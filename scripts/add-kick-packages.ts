import { prisma } from "../src/lib/prisma";

async function run() {
  const kick = await prisma.platform.findUnique({
    where: { slug: "kick" },
    include: { categories: true },
  });

  if (!kick) {
    console.log("Kick bulunamadı");
    return;
  }

  let cat = await prisma.category.findFirst({
    where: { platformId: kick.id, slug: "saatlik-canli-izleyici" },
  });

  if (!cat) {
    cat = await prisma.category.create({
      data: {
        platformId: kick.id,
        name: "Saatlik Canlı İzleyici",
        slug: "saatlik-canli-izleyici",
        shortDescription:
          "Kick Canlı İzleyici Saatlik hizmeti ile canlı yayınlarınızın etkileşimini ve görünürlüğünü artırarak daha geniş kitlelere ulaşın! Hızlı, güvenilir ve uygun fiyatlı saatlik izleyici paketlerimiz sayesinde Kick kanalınızı güçlendirin, topluluğunuzu ve etkileşiminizi artırın. Başarılı bir Kick yayıncısı olmak için saatlik izleyici desteği ile dikkat çekin ve hedeflerinize daha hızlı ulaşın. Şimdi deneyin!",
        sortOrder: 0,
      },
    });
  }

  const pkgs = [
    { name: "1 Saatlik 5 İzleyici", slug: "kick-1-saatlik-5-izleyici", price: 6.50, quantity: 5 },
    { name: "1 Saatlik 10 İzleyici", slug: "kick-1-saatlik-10-izleyici", price: 7.00, quantity: 10 },
    { name: "1 Saatlik 15 İzleyici", slug: "kick-1-saatlik-15-izleyici", price: 7.50, quantity: 15 },
    { name: "1 Saatlik 20 İzleyici", slug: "kick-1-saatlik-20-izleyici", price: 7.80, quantity: 20 },
    { name: "1 Saatlik 50 İzleyici", slug: "kick-1-saatlik-50-izleyici", price: 18.50, quantity: 50 },
    { name: "1 Saatlik 100 İzleyici", slug: "kick-1-saatlik-100-izleyici", price: 35.00, quantity: 100 },
  ];

  for (let i = 0; i < pkgs.length; i++) {
    const p = pkgs[i];
    const exists = await prisma.package.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.package.create({
        data: {
          categoryId: cat.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          quantity: p.quantity,
          features: JSON.stringify([
            "Anlık Başlar",
            `${p.quantity} Canlı İzleyici`,
            `${p.quantity} İzleyici Listesi`,
            "Stabil Görünürlük",
            "Şifresiz İşlem",
          ]),
          isPopular: i < 4,
          sortOrder: i + 1,
        },
      });
    }
  }

  console.log("KICK SAATLIK KATEGORISI VE PAKETLERI BASARIYLA EKLENDI!");
}

run()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
