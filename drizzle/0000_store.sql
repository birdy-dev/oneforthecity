CREATE TABLE IF NOT EXISTS `inventory_stock` (
  `product_id` text NOT NULL,
  `size` text NOT NULL,
  `base_quantity` integer NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `inventory_stock_product_size_idx`
ON `inventory_stock` (`product_id`, `size`);

CREATE TABLE IF NOT EXISTS `inventory_adjustments` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `product_id` text NOT NULL,
  `size` text NOT NULL,
  `delta` integer NOT NULL,
  `reason` text NOT NULL,
  `created_at` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `inventory_adjustments_product_size_idx`
ON `inventory_adjustments` (`product_id`, `size`);

CREATE TABLE IF NOT EXISTS `in_person_sales` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `product_id` text NOT NULL,
  `size` text NOT NULL,
  `quantity` integer NOT NULL,
  `note` text,
  `created_at` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `in_person_sales_product_size_idx`
ON `in_person_sales` (`product_id`, `size`);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `stripe_session_id` text NOT NULL,
  `stripe_payment_intent_id` text,
  `customer_email` text NOT NULL,
  `customer_name` text,
  `fulfilled` integer DEFAULT false NOT NULL,
  `paid_at` text NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `orders_stripe_session_id_idx`
ON `orders` (`stripe_session_id`);
CREATE INDEX IF NOT EXISTS `orders_customer_email_idx`
ON `orders` (`customer_email`);
CREATE INDEX IF NOT EXISTS `orders_fulfilled_paid_at_idx`
ON `orders` (`fulfilled`, `paid_at`);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_id` integer NOT NULL,
  `product_id` text NOT NULL,
  `product_name` text NOT NULL,
  `size` text NOT NULL,
  `quantity` integer NOT NULL,
  `unit_amount` integer NOT NULL,
  `currency` text NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `order_items_product_size_idx`
ON `order_items` (`product_id`, `size`);

DELETE FROM `order_items`
WHERE `id` NOT IN (
  SELECT MIN(`id`)
  FROM `order_items`
  GROUP BY `order_id`, `product_id`, `size`
);

CREATE UNIQUE INDEX IF NOT EXISTS `order_items_order_product_size_idx`
ON `order_items` (`order_id`, `product_id`, `size`);

INSERT OR IGNORE INTO `inventory_stock`
  (`product_id`, `size`, `base_quantity`, `created_at`, `updated_at`)
VALUES
  ('vol-6-tee', 'S', 5, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('vol-6-tee', 'M', 20, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('vol-6-tee', 'L', 35, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('vol-6-tee', 'XL', 15, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('classic-tee', 'S', 20, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('classic-tee', 'M', 30, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('classic-tee', 'L', 30, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('classic-tee', 'XL', 20, '2026-06-07T00:00:00.000Z', '2026-06-07T00:00:00.000Z'),
  ('blue-embroidered-tee', 'S', 1, '2026-06-15T00:00:00.000Z', '2026-06-15T00:00:00.000Z'),
  ('blue-embroidered-tee', 'L', 10, '2026-06-15T00:00:00.000Z', '2026-06-15T00:00:00.000Z'),
  ('blue-embroidered-tee', 'XL', 10, '2026-06-15T00:00:00.000Z', '2026-06-15T00:00:00.000Z'),
  ('blue-embroidered-tee', 'XXL', 3, '2026-06-15T00:00:00.000Z', '2026-06-15T00:00:00.000Z');
