-- Seed data for Albertsons Product Search System
-- Drops existing records just in case to avoid duplicates in dynamic context
DELETE FROM product;

-- In Spring Boot, Hibernate creates the Product table based on Entity structure.
-- Let's populate standard rows matching the frontend catalog:
INSERT INTO product (id, name, brand, category, price, original_price, rating, reviews_count, is_organic, is_sale, size, is_gluten_free, image_url, description, dept_id) VALUES
('prod-1', 'O Organics Organic Bananas', 'O ORGANICS', 'produce', 1.89, NULL, 4.8, 1240, TRUE, FALSE, '1 bunch (~5-6 ct)', TRUE, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e', 'Fresh organic bananas grown without synthetic pesticides. High in potassium and perfect for snacking.', 'produce'),

('prod-2', 'Honeycrisp Apples', 'SIGNATURE FARMS', 'produce', 2.49, 3.29, 4.5, 312, FALSE, TRUE, '1 lb', TRUE, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6', 'Crisp, sweet, and slightly tart. Perfect for snacking, salads, or putting into home-baked pies.', 'produce'),

('prod-3', 'Lucerne Whole Milk', 'LUCERNE', 'dairy', 3.49, 4.19, 4.9, 844, FALSE, TRUE, '1 Gallon', TRUE, 'https://images.unsplash.com/photo-1550583724-b2692b85b150', 'Lucerne Whole Milk, Vitamin D fortified, fine pasteurized quality.', 'dairy'),

('prod-4', 'Fresh Strawberries', 'Driscolls', 'produce', 3.99, NULL, 4.6, 452, FALSE, FALSE, '16 oz Clamshell', TRUE, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6', 'Juicy, premium quality fresh strawberries picked in full flavor.', 'produce'),

('prod-5', 'O Organics Baby Spinach', 'O ORGANICS', 'produce', 4.29, NULL, 4.7, 198, TRUE, FALSE, '5 oz', TRUE, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 'USDA Organic ready-to-eat pre-washed baby spinach leaves.', 'produce'),

('prod-6', 'Lucerne Grade A Large Eggs', 'LUCERNE', 'dairy', 3.99, NULL, 4.8, 1512, FALSE, FALSE, '12 ct', TRUE, 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441', 'Lucerne Grade A Large Farm Fresh Eggs. High protein choice.', 'dairy'),

('prod-7', 'French Baguette', 'SIGNATURE SELECT', 'bakery', 1.99, 2.49, 4.4, 94, FALSE, TRUE, '12 oz', FALSE, 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 'In-store hand-baked daily golden crust baguette breads.', 'bakery'),

('prod-8', 'Organic Honey Wheat Bread', 'O ORGANICS', 'bakery', 3.49, NULL, 4.7, 220, TRUE, FALSE, '20 oz', FALSE, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73', 'Delicious USDA organic wheat bread infused with honey.', 'bakery'),

('prod-9', 'Gluten-Free Chocolate Chip Cookies', 'SIGNATURE SELECT', 'bakery', 4.99, NULL, 4.3, 88, FALSE, FALSE, '8 oz', TRUE, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e', 'Crisp gluten-free recipe chocolate chip gourmet cookies.', 'bakery'),

('prod-10', 'Boneless Skinless Chicken Breasts', 'SIGNATURE FARMS', 'meat', 3.99, 5.49, 4.6, 521, FALSE, TRUE, '1 lb', TRUE, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791', 'Super trimmed lean boneless skinless fresh chicken breasts.', 'meat'),

('prod-11', 'USDA Choice Ribeye Steak', 'SIGNATURE SELECT', 'meat', 13.99, NULL, 4.7, 142, FALSE, FALSE, '1 lb', TRUE, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617', 'Perfect choice Ribeye steaks. Rich and exceptionally marbled.', 'meat'),

('prod-12', 'Fresh Atlantic Salmon Fillet', 'WATERFLOW', 'meat', 9.99, 12.99, 4.8, 260, FALSE, TRUE, '1 lb', TRUE, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 'Freshly filleted high-omega atlantic seafood portion salmon.', 'meat'),

('prod-13', 'O Organics Creamy Peanut Butter', 'O ORGANICS', 'pantry', 4.59, NULL, 4.6, 191, TRUE, FALSE, '16 oz', TRUE, 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e', 'USDA organic creamy natural peanut spread without added sugar.', 'pantry'),

('prod-14', 'Signature Select Pure Honey', 'SIGNATURE SELECT', 'pantry', 5.99, NULL, 4.8, 134, FALSE, FALSE, '12 oz Bottle', TRUE, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', '100% natural Grade A pure premium white clover honey.', 'pantry'),

('prod-15', 'Lucerne Sour Cream', 'LUCERNE', 'dairy', 2.19, NULL, 4.7, 412, FALSE, FALSE, '16 oz Bowl', TRUE, 'https://images.unsplash.com/photo-1528750953866-abf4d0dd9a44', 'Savoury thick sour cream made using fresh sour milk enzymes.', 'dairy'),

('prod-16', 'Signature Select Organic Quinoa', 'SIGNATURE SELECT', 'pantry', 3.49, 3.99, 4.5, 78, TRUE, TRUE, '16 oz Bag', TRUE, 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 'High organic plant proteins gluten-free organic whole seeds.', 'pantry'),

('prod-17', 'LaCroix Sparkling Water Lime', 'LACROIX', 'beverages', 5.49, NULL, 4.8, 1042, FALSE, FALSE, '12 Pack - 12 oz Cans', TRUE, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', 'Thirst quencher calorie-free carbonated water refreshment.', 'beverages'),

('prod-18', 'Signature Select Apple Juice', 'SIGNATURE SELECT', 'beverages', 2.99, 3.79, 4.6, 221, FALSE, TRUE, '64 oz Bottle', TRUE, 'https://images.unsplash.com/photo-1613478223719-2ab802602423', 'Lucrative pure apple juices rich in healthy vital anti-oxidants.', 'beverages'),

('prod-19', 'Signature Select Frozen Pepperoni Pizza', 'SIGNATURE SELECT', 'frozen', 4.49, 5.99, 4.4, 384, FALSE, TRUE, '22 oz Box', FALSE, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'Gourmet frozen family-size crust pizzas topped with pepperoni.', 'frozen'),

('prod-20', 'O Organics Frozen Strawberries', 'O ORGANICS', 'frozen', 5.99, NULL, 4.7, 112, TRUE, FALSE, '10 oz Bag', TRUE, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Frozen USDA biological fresh selected whole strawberries.', 'frozen');
