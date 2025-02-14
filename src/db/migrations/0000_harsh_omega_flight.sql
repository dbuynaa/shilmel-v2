CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "Address" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"state" text,
	"postalCode" text NOT NULL,
	"country" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Address_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "CartItem" (
	"id" text PRIMARY KEY NOT NULL,
	"cartId" text NOT NULL,
	"variantId" text NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Cart" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"parentId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Category_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Image" (
	"id" text PRIMARY KEY NOT NULL,
	"variantId" text NOT NULL,
	"url" text NOT NULL,
	"altText" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Image_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"variantId" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "OrderItem_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"shippingAddressId" text NOT NULL,
	"totalAmount" numeric(10, 2) NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"paymentMethod" text DEFAULT 'card' NOT NULL,
	"paymentStatus" "PaymentStatus" DEFAULT 'PENDING' NOT NULL,
	"paymentId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Order_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "PaymentStatus" DEFAULT 'PENDING' NOT NULL,
	"transactionId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Payment_transactionId_unique" UNIQUE("transactionId")
);
--> statement-breakpoint
CREATE TABLE "ProductVariant" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"size" text NOT NULL,
	"color" text NOT NULL,
	"material" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProductVariant_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"discount" numeric(5, 2),
	"categoryId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Product_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"last_activity_date" timestamp DEFAULT now(),
	CONSTRAINT "User_id_unique" UNIQUE("id"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_Cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_ProductVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Image" ADD CONSTRAINT "Image_variantId_ProductVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_ProductVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_Address_id_fk" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."Address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;