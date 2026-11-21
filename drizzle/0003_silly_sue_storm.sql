ALTER TABLE "orders" ADD COLUMN "reference" text;--> statement-breakpoint
CREATE INDEX "orders_reference_idx" ON "orders" USING btree ("reference");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_reference_unique" UNIQUE("reference");