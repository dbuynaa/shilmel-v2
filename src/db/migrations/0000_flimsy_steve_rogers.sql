CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	CONSTRAINT "Category_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Customization" (
	"id" text PRIMARY KEY NOT NULL,
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
	"id" text PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"image" text[] NOT NULL,
	"productId" text NOT NULL,
	CONSTRAINT "ImageColor_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" text PRIMARY KEY NOT NULL,
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
	"id" text PRIMARY KEY NOT NULL,
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
	"id" text PRIMARY KEY NOT NULL,
	"material" text NOT NULL,
	"productId" text NOT NULL,
	CONSTRAINT "ProductMaterial_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
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
	"id" text PRIMARY KEY NOT NULL,
	"size" text NOT NULL,
	"stock" integer NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "SizeQuantity_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text NOT NULL,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"emailVerified" timestamp (3),
	"emailVerificationToken" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"last_activity_date" date DEFAULT now(),
	CONSTRAINT "User_id_unique" UNIQUE("id"),
	CONSTRAINT "User_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
CREATE TABLE "WorkBranch" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text NOT NULL,
	"parentId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "WorkBranch_id_unique" UNIQUE("id")
);
