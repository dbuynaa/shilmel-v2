CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "CartItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cartId" text NOT NULL,
	"productId" text,
	"quantity" integer NOT NULL,
	"size" text NOT NULL,
	"color" text NOT NULL,
	CONSTRAINT "CartItem_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "Cart_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	CONSTRAINT "Category_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Customization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderNumber" text NOT NULL,
	"logoPosition" text,
	"logoFile" text,
	"notes" text,
	"productId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "Customization_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "ImageColor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"color" text NOT NULL,
	"image" text[] NOT NULL,
	"productId" text NOT NULL,
	CONSTRAINT "ImageColor_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantity" integer NOT NULL,
	"size" text NOT NULL,
	"color" text NOT NULL,
	"price" integer NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "OrderItem_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"totalAmount" integer NOT NULL,
	"paymentMethod" text DEFAULT 'card' NOT NULL,
	"paymentStatus" text DEFAULT 'PENDING' NOT NULL,
	"paymentId" text,
	"userId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "Order_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "ProductMaterial" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material" text NOT NULL,
	"productId" text NOT NULL,
	CONSTRAINT "ProductMaterial_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"discount" integer,
	"categoryId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"workBranchId" text,
	CONSTRAINT "Product_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "SizeQuantity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"size" text NOT NULL,
	"stock" integer NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "SizeQuantity_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp (3),
	"password" text NOT NULL,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"image" text,
	"last_activity_date" date DEFAULT now(),
	CONSTRAINT "User_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "WorkBranch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text NOT NULL,
	"parentId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "WorkBranch_id_unique" UNIQUE("id")
);
