export type Category = "Furniture" | "Electronics" | "Kitchen" | "Clothing" | "Other";
export type Condition = "New" | "Used" | "Refurbished" | "Special Deal";
export type City = "Tel Aviv" | "Jerusalem" | "Haifa" | "Eilat";

export interface Seller {
  name: string;
  avatar?: string;
  rating: number;
}

export interface Listing {
  id: string;
  title: string;
  category: Category;
  condition: Condition;
  city: City;
  originalPrice: number;
  sellPrice: number;
  description: string;
  images: string[];
  seller: Seller;
  createdAt: string;
  isWatchlisted: boolean;
}

export const dummyListings: Listing[] = [
  {
    id: "1",
    title: "Vintage Leather Sofa",
    category: "Furniture",
    condition: "Special Deal",
    city: "Tel Aviv",
    originalPrice: 3200,
    sellPrice: 1800,
    description: "Beautiful vintage leather sofa in great condition. Perfect for a cozy living room. Minor scratches on the back but otherwise perfect.",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    seller: { name: "דוד לוי (David Levi)", rating: 4.8 },
    createdAt: "2024-05-10T10:00:00Z",
    isWatchlisted: false
  },
  {
    id: "2",
    title: "MacBook Pro 2022",
    category: "Electronics",
    condition: "Used",
    city: "Jerusalem",
    originalPrice: 9500,
    sellPrice: 6200,
    description: "MacBook Pro M2, 16GB RAM, 512GB SSD. Like new, used for only 6 months. Comes with original charger and box.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    seller: { name: "מוחמד עלי (Mohammad Ali)", rating: 4.9 },
    createdAt: "2024-05-11T14:30:00Z",
    isWatchlisted: true
  },
  {
    id: "3",
    title: "KitchenAid Mixer",
    category: "Kitchen",
    condition: "Refurbished",
    city: "Haifa",
    originalPrice: 2100,
    sellPrice: 1100,
    description: "Classic red KitchenAid stand mixer. Refurbished by official dealer, works perfectly. Includes paddle, dough hook, and whisk.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    seller: { name: "לילי כהן (Lily Cohen)", rating: 4.5 },
    createdAt: "2024-05-12T09:15:00Z",
    isWatchlisted: false
  },
  {
    id: "4",
    title: "Teak Dining Table",
    category: "Furniture",
    condition: "Used",
    city: "Eilat",
    originalPrice: 4500,
    sellPrice: 2800,
    description: "Solid teak dining table, seats 6-8. Minimalist Danish design. Chairs not included.",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
    seller: { name: "أحمد حسين (Ahmad Hussein)", rating: 4.7 },
    createdAt: "2024-05-12T16:45:00Z",
    isWatchlisted: false
  },
  {
    id: "5",
    title: "iPhone 14 Pro",
    category: "Electronics",
    condition: "Special Deal",
    city: "Tel Aviv",
    originalPrice: 5200,
    sellPrice: 4100,
    description: "Brand new sealed iPhone 14 Pro 256GB Deep Purple. Unwanted gift.",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    seller: { name: "רחל מזרחי (Rachel Mizrahi)", rating: 5.0 },
    createdAt: "2024-05-13T11:20:00Z",
    isWatchlisted: false
  },
  {
    id: "6",
    title: "French Press Set",
    category: "Kitchen",
    condition: "New",
    city: "Jerusalem",
    originalPrice: 380,
    sellPrice: 220,
    description: "Premium glass and stainless steel French press with two matching mugs. Never used, still in box.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    seller: { name: "דוד לוי (David Levi)", rating: 4.8 },
    createdAt: "2024-05-14T08:00:00Z",
    isWatchlisted: false
  },
  {
    id: "7",
    title: "Linen Blazer",
    category: "Clothing",
    condition: "Used",
    city: "Haifa",
    originalPrice: 890,
    sellPrice: 420,
    description: "Italian linen blazer, size M. Light beige color, perfect for summer evenings.",
    images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    seller: { name: "לילי כהן (Lily Cohen)", rating: 4.5 },
    createdAt: "2024-05-14T13:10:00Z",
    isWatchlisted: true
  },
  {
    id: "8",
    title: "Bookshelf (Teak)",
    category: "Furniture",
    condition: "Used",
    city: "Tel Aviv",
    originalPrice: 1800,
    sellPrice: 950,
    description: "Mid-century modern teak bookshelf. 5 tiers. Great condition.",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
    seller: { name: "מוחמד עלי (Mohammad Ali)", rating: 4.9 },
    createdAt: "2024-05-15T10:30:00Z",
    isWatchlisted: false
  },
  {
    id: "9",
    title: "Sony WH-1000XM5",
    category: "Electronics",
    condition: "Refurbished",
    city: "Jerusalem",
    originalPrice: 1850,
    sellPrice: 1200,
    description: "Top tier noise cancelling headphones. Factory refurbished, new ear pads.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"],
    seller: { name: "أحمد حسين (Ahmad Hussein)", rating: 4.7 },
    createdAt: "2024-05-15T15:20:00Z",
    isWatchlisted: false
  },
  {
    id: "10",
    title: "Cashmere Coat",
    category: "Clothing",
    condition: "Special Deal",
    city: "Tel Aviv",
    originalPrice: 2400,
    sellPrice: 1650,
    description: "Luxury 100% cashmere winter coat, size L. Black. Worn once.",
    images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    seller: { name: "רחל מזרחי (Rachel Mizrahi)", rating: 5.0 },
    createdAt: "2024-05-16T09:45:00Z",
    isWatchlisted: false
  },
  {
    id: "11",
    title: "Nespresso Machine",
    category: "Kitchen",
    condition: "Used",
    city: "Haifa",
    originalPrice: 1100,
    sellPrice: 580,
    description: "Vertuo Next coffee machine. Includes milk frother. Descaled regularly.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    seller: { name: "דוד לוי (David Levi)", rating: 4.8 },
    createdAt: "2024-05-16T12:30:00Z",
    isWatchlisted: false
  },
  {
    id: "12",
    title: "Velvet Armchair",
    category: "Furniture",
    condition: "Refurbished",
    city: "Eilat",
    originalPrice: 2200,
    sellPrice: 1100,
    description: "Deep green velvet armchair. Professionally reupholstered last month.",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
    seller: { name: "לילי כהן (Lily Cohen)", rating: 4.5 },
    createdAt: "2024-05-17T11:15:00Z",
    isWatchlisted: true
  },
  {
    id: "13",
    title: "iPad Pro 12.9",
    category: "Electronics",
    condition: "Used",
    city: "Tel Aviv",
    originalPrice: 5800,
    sellPrice: 3400,
    description: "M1 iPad Pro 12.9 inch 256GB WiFi. Small scratch on bezel, screen is perfect. Apple Pencil included.",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    seller: { name: "מוחמד עלי (Mohammad Ali)", rating: 4.9 },
    createdAt: "2024-05-17T16:00:00Z",
    isWatchlisted: false
  },
  {
    id: "14",
    title: "Ceramic Cookware Set",
    category: "Kitchen",
    condition: "New",
    city: "Jerusalem",
    originalPrice: 1400,
    sellPrice: 780,
    description: "10-piece non-toxic ceramic cookware set in cream. Unopened box.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    seller: { name: "أحمد حسين (Ahmad Hussein)", rating: 4.7 },
    createdAt: "2024-05-18T10:20:00Z",
    isWatchlisted: false
  },
  {
    id: "15",
    title: "Vintage Denim Jacket",
    category: "Clothing",
    condition: "Used",
    city: "Haifa",
    originalPrice: 650,
    sellPrice: 280,
    description: "Authentic 90s Levi's denim jacket. Naturally faded and beautifully worn in. Size L.",
    images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"],
    seller: { name: "רחל מזרחי (Rachel Mizrahi)", rating: 5.0 },
    createdAt: "2024-05-18T14:45:00Z",
    isWatchlisted: false
  },
  {
    id: "16",
    title: "Standing Desk",
    category: "Furniture",
    condition: "Special Deal",
    city: "Tel Aviv",
    originalPrice: 3800,
    sellPrice: 2900,
    description: "Motorized standing desk with solid oak top. 160x80cm. Moving abroad, must sell.",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    seller: { name: "דוד לוי (David Levi)", rating: 4.8 },
    createdAt: "2024-05-19T09:30:00Z",
    isWatchlisted: true
  }
];
