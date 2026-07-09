CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`total_price` integer DEFAULT 0 NOT NULL,
	`pickup_time` text,
	`status` text DEFAULT 'menunggu_pembayaran' NOT NULL,
	`payment_method` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
