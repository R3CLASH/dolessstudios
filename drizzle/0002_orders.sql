CREATE TYPE "public"."order_status" AS ENUM('paid', 'building', 'delivered', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" text NOT NULL,
	"solution" text,
	"product_id" text,
	"name" text,
	"email" text,
	"amount_cents" integer,
	"currency" text,
	"settlement_amount_cents" integer,
	"settlement_currency" text,
	"metadata" jsonb,
	"status" "order_status" DEFAULT 'paid' NOT NULL,
	"emailed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");