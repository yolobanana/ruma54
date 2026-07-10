PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`customer_name` text,
	`customer_phone` text,
	`total_price` integer DEFAULT 0 NOT NULL,
	`pickup_time` text,
	`status` text DEFAULT 'keranjang' NOT NULL,
	`payment_status` text DEFAULT 'belum_dibayar' NOT NULL,
	`payment_method` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "user_id", "total_price", "pickup_time", "status", "payment_method", "created_at") SELECT "id", "user_id", "total_price", "pickup_time", "status", "payment_method", "created_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `order_items` ADD `product_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `unit_price` integer NOT NULL;