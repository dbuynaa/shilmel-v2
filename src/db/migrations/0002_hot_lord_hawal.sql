ALTER TABLE "Category" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT '5f7e55c8-917a-4ae0-8643-bbe90efada16';--> statement-breakpoint
ALTER TABLE "Customization" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Customization" ALTER COLUMN "id" SET DEFAULT 'c6151e83-b301-4560-ae2d-08c914d9204e';--> statement-breakpoint
ALTER TABLE "ImageColor" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ImageColor" ALTER COLUMN "id" SET DEFAULT '0f3c89bd-f038-4251-aeb9-2f561fe931e2';--> statement-breakpoint
ALTER TABLE "OrderItem" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "OrderItem" ALTER COLUMN "id" SET DEFAULT 'd9930a77-d4d1-4113-b759-2228e0215f33';--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "id" SET DEFAULT 'bc64e562-2155-43e0-a0e9-299c609181b3';--> statement-breakpoint
ALTER TABLE "ProductMaterial" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ProductMaterial" ALTER COLUMN "id" SET DEFAULT '6f10941f-aa79-4cb4-8408-a166724cfe9f';--> statement-breakpoint
ALTER TABLE "Product" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT '6c2790f4-0651-4bf6-90bf-3d58a2f64f1d';--> statement-breakpoint
ALTER TABLE "SizeQuantity" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "SizeQuantity" ALTER COLUMN "id" SET DEFAULT 'c76feeba-7478-4f45-8dfe-f36bc4ca059e';--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT 'ce431333-3842-4e9b-a167-cef1577fc282';--> statement-breakpoint
ALTER TABLE "WorkBranch" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "WorkBranch" ALTER COLUMN "id" SET DEFAULT '45dcf943-2273-4e2f-a8f4-dbb72f3e708c';--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "emailVerificationToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "resetPasswordTokenExpiry" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_resetPasswordToken_unique" UNIQUE("resetPasswordToken");