import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { usersTable, listingsTable } from "./schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  // Create demo users
  const [user1] = await db
    .insert(usersTable)
    .values({
      authId: "seed-user-1",
      fullName: "דוד לוי (David Levi)",
      phone: "+972501234567",
    })
    .onConflictDoNothing()
    .returning();

  const [user2] = await db
    .insert(usersTable)
    .values({
      authId: "seed-user-2",
      fullName: "מוחמד עלי (Mohammad Ali)",
      phone: "+972502345678",
    })
    .onConflictDoNothing()
    .returning();

  const [user3] = await db
    .insert(usersTable)
    .values({
      authId: "seed-user-3",
      fullName: "לילי כהן (Lily Cohen)",
      phone: "+972503456789",
    })
    .onConflictDoNothing()
    .returning();

  const [user4] = await db
    .insert(usersTable)
    .values({
      authId: "seed-user-4",
      fullName: "أحمد حسين (Ahmad Hussein)",
      phone: "+970591234567",
    })
    .onConflictDoNothing()
    .returning();

  const [user5] = await db
    .insert(usersTable)
    .values({
      authId: "seed-user-5",
      fullName: "רחל מזרחי (Rachel Mizrahi)",
      phone: "+972504567890",
    })
    .onConflictDoNothing()
    .returning();

  if (!user1 || !user2 || !user3 || !user4 || !user5) {
    console.log("Users already seeded, skipping...");
    await pool.end();
    return;
  }

  const listings = [
    {
      sellerId: user1.id,
      title: "Vintage Leather Sofa",
      category: "Furniture" as const,
      condition: "Special Deal" as const,
      city: "Tel Aviv" as const,
      originalPrice: 3200,
      sellPrice: 1800,
      description: "Beautiful vintage leather sofa in great condition. Perfect for a cozy living room. Minor scratches on the back but otherwise perfect.",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    },
    {
      sellerId: user2.id,
      title: "MacBook Pro 2022",
      category: "Electronics" as const,
      condition: "Used" as const,
      city: "Jerusalem" as const,
      originalPrice: 9500,
      sellPrice: 6200,
      description: "MacBook Pro M2, 16GB RAM, 512GB SSD. Like new, used for only 6 months. Comes with original charger and box.",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    },
    {
      sellerId: user3.id,
      title: "KitchenAid Mixer",
      category: "Kitchen" as const,
      condition: "Refurbished" as const,
      city: "Haifa" as const,
      originalPrice: 2100,
      sellPrice: 1100,
      description: "Classic red KitchenAid stand mixer. Refurbished by official dealer, works perfectly. Includes paddle, dough hook, and whisk.",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    },
    {
      sellerId: user4.id,
      title: "Teak Dining Table",
      category: "Furniture" as const,
      condition: "Used" as const,
      city: "Eilat" as const,
      originalPrice: 4500,
      sellPrice: 2800,
      description: "Solid teak dining table, seats 6-8. Minimalist Danish design. Chairs not included.",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
    },
    {
      sellerId: user5.id,
      title: "iPhone 14 Pro",
      category: "Electronics" as const,
      condition: "Special Deal" as const,
      city: "Tel Aviv" as const,
      originalPrice: 5200,
      sellPrice: 4100,
      description: "Brand new sealed iPhone 14 Pro 256GB Deep Purple. Unwanted gift.",
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    },
    {
      sellerId: user1.id,
      title: "French Press Set",
      category: "Kitchen" as const,
      condition: "New" as const,
      city: "Jerusalem" as const,
      originalPrice: 380,
      sellPrice: 220,
      description: "Premium glass and stainless steel French press with two matching mugs. Never used, still in box.",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    },
    {
      sellerId: user3.id,
      title: "Linen Blazer",
      category: "Clothing" as const,
      condition: "Used" as const,
      city: "Haifa" as const,
      originalPrice: 890,
      sellPrice: 420,
      description: "Italian linen blazer, size M. Light beige color, perfect for summer evenings.",
      images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    },
    {
      sellerId: user2.id,
      title: "Bookshelf (Teak)",
      category: "Furniture" as const,
      condition: "Used" as const,
      city: "Tel Aviv" as const,
      originalPrice: 1800,
      sellPrice: 950,
      description: "Mid-century modern teak bookshelf. 5 tiers. Great condition.",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
    },
    {
      sellerId: user4.id,
      title: "Sony WH-1000XM5",
      category: "Electronics" as const,
      condition: "Refurbished" as const,
      city: "Jerusalem" as const,
      originalPrice: 1850,
      sellPrice: 1200,
      description: "Top tier noise cancelling headphones. Factory refurbished, new ear pads.",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"],
    },
    {
      sellerId: user5.id,
      title: "Cashmere Coat",
      category: "Clothing" as const,
      condition: "Special Deal" as const,
      city: "Tel Aviv" as const,
      originalPrice: 2400,
      sellPrice: 1650,
      description: "Luxury 100% cashmere winter coat, size L. Black. Worn once.",
      images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    },
    {
      sellerId: user1.id,
      title: "Nespresso Machine",
      category: "Kitchen" as const,
      condition: "Used" as const,
      city: "Haifa" as const,
      originalPrice: 1100,
      sellPrice: 580,
      description: "Vertuo Next coffee machine. Includes milk frother. Descaled regularly.",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    },
    {
      sellerId: user3.id,
      title: "Velvet Armchair",
      category: "Furniture" as const,
      condition: "Refurbished" as const,
      city: "Eilat" as const,
      originalPrice: 2200,
      sellPrice: 1100,
      description: "Deep green velvet armchair. Professionally reupholstered last month.",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
    },
    {
      sellerId: user2.id,
      title: "iPad Pro 12.9",
      category: "Electronics" as const,
      condition: "Used" as const,
      city: "Tel Aviv" as const,
      originalPrice: 5800,
      sellPrice: 3400,
      description: "M1 iPad Pro 12.9 inch 256GB WiFi. Small scratch on bezel, screen is perfect. Apple Pencil included.",
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    },
    {
      sellerId: user4.id,
      title: "Ceramic Cookware Set",
      category: "Kitchen" as const,
      condition: "New" as const,
      city: "Jerusalem" as const,
      originalPrice: 1400,
      sellPrice: 780,
      description: "10-piece non-toxic ceramic cookware set in cream. Unopened box.",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    },
    {
      sellerId: user5.id,
      title: "Vintage Denim Jacket",
      category: "Clothing" as const,
      condition: "Used" as const,
      city: "Haifa" as const,
      originalPrice: 650,
      sellPrice: 280,
      description: "Authentic 90s Levi's denim jacket. Naturally faded and beautifully worn in. Size L.",
      images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    },
    {
      sellerId: user1.id,
      title: "Standing Desk",
      category: "Furniture" as const,
      condition: "Special Deal" as const,
      city: "Tel Aviv" as const,
      originalPrice: 3800,
      sellPrice: 2900,
      description: "Motorized standing desk with solid oak top. 160x80cm. Moving abroad, must sell.",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    },
  ];

  await db.insert(listingsTable).values(listings);

  console.log(`Seeded ${listings.length} listings with 5 users`);
  await pool.end();
}

seed().catch(console.error);
