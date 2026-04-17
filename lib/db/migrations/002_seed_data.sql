-- ============================================================
-- Second-Hand-Style — Seed Data (demo users + 16 listings)
-- Run AFTER 001_initial_schema.sql
-- NOTE: These are demo users with fake auth_ids (not linked to real Supabase auth users).
--       They're useful for testing the UI. Real users will be created via the signup flow.
-- ============================================================

INSERT INTO "users" ("id", "auth_id", "full_name", "phone") VALUES
  ('aaaaaaaa-0001-4000-a000-000000000001', 'seed-user-1', 'דוד לוי (David Levi)',        '+972501234567'),
  ('aaaaaaaa-0002-4000-a000-000000000002', 'seed-user-2', 'מוחמד עלי (Mohammad Ali)',      '+972502345678'),
  ('aaaaaaaa-0003-4000-a000-000000000003', 'seed-user-3', 'לילי כהן (Lily Cohen)',         '+972503456789'),
  ('aaaaaaaa-0004-4000-a000-000000000004', 'seed-user-4', 'أحمد حسين (Ahmad Hussein)',     '+970591234567'),
  ('aaaaaaaa-0005-4000-a000-000000000005', 'seed-user-5', 'רחל מזרחי (Rachel Mizrahi)',    '+972504567890')
ON CONFLICT DO NOTHING;

INSERT INTO "listings" ("seller_id", "title", "description", "category", "condition", "city", "original_price", "sell_price", "images") VALUES
  ('aaaaaaaa-0001-4000-a000-000000000001', 'Vintage Leather Sofa',    'Beautiful vintage leather sofa in great condition. Perfect for a cozy living room.',                                                  'Furniture',    'Special Deal', 'Tel Aviv',   3200, 1800, ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']),
  ('aaaaaaaa-0002-4000-a000-000000000002', 'MacBook Pro 2022',        'MacBook Pro M2, 16GB RAM, 512GB SSD. Like new, used for only 6 months. Comes with original charger and box.',                          'Electronics',  'Used',         'Jerusalem',  9500, 6200, ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800']),
  ('aaaaaaaa-0003-4000-a000-000000000003', 'KitchenAid Mixer',        'Classic red KitchenAid stand mixer. Refurbished by official dealer, works perfectly.',                                                  'Kitchen',      'Refurbished',  'Haifa',      2100, 1100, ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),
  ('aaaaaaaa-0004-4000-a000-000000000004', 'Teak Dining Table',       'Solid teak dining table, seats 6-8. Minimalist Danish design. Chairs not included.',                                                   'Furniture',    'Used',         'Eilat',      4500, 2800, ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600']),
  ('aaaaaaaa-0005-4000-a000-000000000005', 'iPhone 14 Pro',           'Brand new sealed iPhone 14 Pro 256GB Deep Purple. Unwanted gift.',                                                                      'Electronics',  'Special Deal', 'Tel Aviv',   5200, 4100, ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800']),
  ('aaaaaaaa-0001-4000-a000-000000000001', 'French Press Set',        'Premium glass and stainless steel French press with two matching mugs. Never used, still in box.',                                       'Kitchen',      'New',          'Jerusalem',   380,  220, ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),
  ('aaaaaaaa-0003-4000-a000-000000000003', 'Linen Blazer',            'Italian linen blazer, size M. Light beige color, perfect for summer evenings.',                                                         'Clothing',     'Used',         'Haifa',       890,  420, ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800']),
  ('aaaaaaaa-0002-4000-a000-000000000002', 'Bookshelf (Teak)',        'Mid-century modern teak bookshelf. 5 tiers. Great condition.',                                                                          'Furniture',    'Used',         'Tel Aviv',   1800,  950, ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']),
  ('aaaaaaaa-0004-4000-a000-000000000004', 'Sony WH-1000XM5',        'Top tier noise cancelling headphones. Factory refurbished, new ear pads.',                                                               'Electronics',  'Refurbished',  'Jerusalem',  1850, 1200, ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']),
  ('aaaaaaaa-0005-4000-a000-000000000005', 'Cashmere Coat',           'Luxury 100% cashmere winter coat, size L. Black. Worn once.',                                                                            'Clothing',     'Special Deal', 'Tel Aviv',   2400, 1650, ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800']),
  ('aaaaaaaa-0001-4000-a000-000000000001', 'Nespresso Machine',       'Vertuo Next coffee machine. Includes milk frother. Descaled regularly.',                                                                'Kitchen',      'Used',         'Haifa',      1100,  580, ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),
  ('aaaaaaaa-0003-4000-a000-000000000003', 'Velvet Armchair',         'Deep green velvet armchair. Professionally reupholstered last month.',                                                                   'Furniture',    'Refurbished',  'Eilat',      2200, 1100, ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']),
  ('aaaaaaaa-0002-4000-a000-000000000002', 'iPad Pro 12.9',           'M1 iPad Pro 12.9 inch 256GB WiFi. Small scratch on bezel, screen is perfect. Apple Pencil included.',                                   'Electronics',  'Used',         'Tel Aviv',   5800, 3400, ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800']),
  ('aaaaaaaa-0004-4000-a000-000000000004', 'Ceramic Cookware Set',    '10-piece non-toxic ceramic cookware set in cream. Unopened box.',                                                                        'Kitchen',      'New',          'Jerusalem',  1400,  780, ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),
  ('aaaaaaaa-0005-4000-a000-000000000005', 'Vintage Denim Jacket',   'Authentic 90s Levi''s denim jacket. Naturally faded and beautifully worn in. Size L.',                                                    'Clothing',     'Used',         'Haifa',       650,  280, ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800']),
  ('aaaaaaaa-0001-4000-a000-000000000001', 'Standing Desk',           'Motorized standing desk with solid oak top. 160x80cm. Moving abroad, must sell.',                                                       'Furniture',    'Special Deal', 'Tel Aviv',   3800, 2900, ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'])
;

-- ============================================================
-- DONE — 5 demo users + 16 listings seeded
-- ============================================================
