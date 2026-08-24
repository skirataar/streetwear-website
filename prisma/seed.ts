import { PrismaClient, Fit } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Indian Streetwear Storefront collections and drops...");

  // Clean existing data if any
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});

  const colDD = await prisma.collection.create({
    data: {
      slug: "dd-national",
      name: "DD NATIONAL",
      description: "Broadcast calibration charts, 8-bit tuning bars, and evening national hookups.",
      active: true,
    },
  });

  const colSTD = await prisma.collection.create({
    data: {
      slug: "std-isd-pco",
      name: "STD // ISD // PCO",
      description: "Illuminated yellow signboards, 1-rupee brass coins, and timed pulse meter calls.",
      active: true,
    },
  });

  const colY2K = await prisma.collection.create({
    data: {
      slug: "y2k-cybercafe",
      name: "Y2K // CYBERCAFÉ",
      description: "56kbps dial-up modems, smoky corner booths, Yahoo Messenger, and Winamp skins.",
      active: true,
    },
  });

  const colSharjah = await prisma.collection.create({
    data: {
      slug: "sharjah-cricket",
      name: "SHARJAH '98 CRICKET",
      description: "CRT sandstorm broadcasts, manual scorecards, and golden desert storm knocks.",
      active: true,
    },
  });

  const colVHS = await prisma.collection.create({
    data: {
      slug: "vhs-cassette",
      name: "VHS // CASSETTE CULTURE",
      description: "Magnetic tape spools, pencil rewind hacks, tracking glitch scanlines, and mixtape liners.",
      active: true,
    },
  });

  const colBollywood = await prisma.collection.create({
    data: {
      slug: "90s-bollywood",
      name: "90S BOLLYWOOD HOARDINGS",
      description: "Single-screen cinema facades, hand-painted action typography, and dramatic pulp titles.",
      active: true,
    },
  });

  // Product 1
  const p1 = await prisma.product.create({
    data: {
      slug: "dd-national-test-pattern-tee",
      name: "DD National Test Pattern Tee",
      description: "Heavyweight 240 GSM French Terry drop featuring the iconic circular Doordarshan test card broadcast spectrum. Complete with 8-bit calibration stripes, frequency dial coordinates, and raw edge collar finishing.",
      basePrice: 185000,
      fit: Fit.OVERSIZED,
      era: "DD NATIONAL",
      collectionId: colDD.id,
      featured: true,
      active: true,
      images: {
        create: [
          {
            staticUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/dog.mp4",
            altText: "DD National Test Pattern Oversized Tee front visual",
            position: 0,
          },
          {
            staticUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
            altText: "DD National Test Pattern Tee back print detail",
            position: 1,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", colorway: "Vintage Paper", sku: "DD-TST-S", stock: 8 },
          { size: "M", colorway: "Vintage Paper", sku: "DD-TST-M", stock: 14 },
          { size: "L", colorway: "Vintage Paper", sku: "DD-TST-L", stock: 19 },
          { size: "XL", colorway: "Vintage Paper", sku: "DD-TST-XL", stock: 6 },
          { size: "XXL", colorway: "Vintage Paper", sku: "DD-TST-XXL", stock: 3 },
        ],
      },
    },
  });

  // Product 2
  await prisma.product.create({
    data: {
      slug: "std-pco-one-rupee-booth-tee",
      name: "STD PCO 1-Rupee Booth Tee",
      description: "Tribute to the yellow-and-black illuminated booths and the legendary brass ₹1 coin telephone drop. Screenprinted with 3D high-density puff ink detailing STD pulse codes and rate charts across the spine.",
      basePrice: 165000,
      fit: Fit.REGULAR,
      era: "STD-ISD-PCO",
      collectionId: colSTD.id,
      featured: true,
      active: true,
      images: {
        create: [
          {
            staticUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/sea-turtle.mp4",
            altText: "STD PCO 1-Rupee Booth Regular Tee front view",
            position: 0,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", colorway: "Mustard Tape", sku: "STD-1RS-S", stock: 5 },
          { size: "M", colorway: "Mustard Tape", sku: "STD-1RS-M", stock: 12 },
          { size: "L", colorway: "Mustard Tape", sku: "STD-1RS-L", stock: 9 },
          { size: "XL", colorway: "Mustard Tape", sku: "STD-1RS-XL", stock: 4 },
          { size: "XXL", colorway: "Mustard Tape", sku: "STD-1RS-XXL", stock: 2 },
        ],
      },
    },
  });

  // Product 3
  await prisma.product.create({
    data: {
      slug: "y2k-cybercafe-56kbps-tee",
      name: "Y2K Cybercafé 56kbps Dial-Up Tee",
      description: "Dedicated to smoky cabin counters, Yahoo! Chat ASL rooms, Winamp equalizer skins, and floppy disk archives. Cut in our signature boxy oversized drape with CRT scanline typography.",
      basePrice: 195000,
      fit: Fit.OVERSIZED,
      era: "Y2K CYBERCAFÉ",
      collectionId: colY2K.id,
      featured: true,
      active: true,
      images: {
        create: [
          {
            staticUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/flower.mp4",
            altText: "Y2K Cybercafé 56kbps Dial-Up Tee front",
            position: 0,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", colorway: "Signal Red", sku: "Y2K-56K-S", stock: 7 },
          { size: "M", colorway: "Signal Red", sku: "Y2K-56K-M", stock: 15 },
          { size: "L", colorway: "Signal Red", sku: "Y2K-56K-L", stock: 11 },
          { size: "XL", colorway: "Signal Red", sku: "Y2K-56K-XL", stock: 5 },
          { size: "XXL", colorway: "Signal Red", sku: "Y2K-56K-XXL", stock: 1 },
        ],
      },
    },
  });

  // Product 4
  await prisma.product.create({
    data: {
      slug: "sharjah-98-desert-storm-tee",
      name: "Sharjah '98 Desert Storm Scoreboard Tee",
      description: "Commemorating the golden era of CRT television sandstorms, late-night antenna adjustments, and masterclass desert centuries. Digitally pixelated manual scoreboard layout on 240 GSM carded cotton.",
      basePrice: 185000,
      fit: Fit.OVERSIZED,
      era: "SHARJAH CRICKET",
      collectionId: colSharjah.id,
      featured: true,
      active: true,
      images: {
        create: [
          {
            staticUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/dog.mp4",
            altText: "Sharjah 98 Desert Storm Scoreboard Tee front",
            position: 0,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", colorway: "Deep CRT Teal", sku: "SHJ-98-S", stock: 4 },
          { size: "M", colorway: "Deep CRT Teal", sku: "SHJ-98-M", stock: 10 },
          { size: "L", colorway: "Deep CRT Teal", sku: "SHJ-98-L", stock: 8 },
          { size: "XL", colorway: "Deep CRT Teal", sku: "SHJ-98-XL", stock: 3 },
        ],
      },
    },
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
