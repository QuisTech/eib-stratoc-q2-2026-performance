ALTER TABLE "courses" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mustChangePassword" boolean DEFAULT true NOT NULL;