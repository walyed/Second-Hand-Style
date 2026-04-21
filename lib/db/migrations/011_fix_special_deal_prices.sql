-- Fix Special Deal item prices to be exactly 80% of original_price (20% off)
UPDATE listings
SET sell_price = ROUND(original_price * 0.8)
WHERE condition = 'Special Deal';
