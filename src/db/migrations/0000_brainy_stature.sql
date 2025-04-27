CREATE TYPE "public"."DiscountType" AS ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');--> statement-breakpoint
CREATE TYPE "public"."FinancialStatus" AS ENUM('PENDING', 'AUTHORIZED', 'PARTIALLY_PAID', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'VOIDED');--> statement-breakpoint
CREATE TYPE "public"."FulfillmentStatus" AS ENUM('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RESTOCKED');--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."ProductStatus" AS ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'PUBLISHED');--> statement-breakpoint
CREATE TYPE "public"."TransactionKind" AS ENUM('SALE', 'CAPTURE', 'AUTHORIZATION', 'VOID', 'REFUND');--> statement-breakpoint
CREATE TYPE "public"."TransactionStatus" AS ENUM('PENDING', 'SUCCESS', 'FAILURE', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('ADMIN', 'STAFF', 'CUSTOMER');--> statement-breakpoint
CREATE TYPE "public"."WeightUnit" AS ENUM('KG', 'G', 'LB', 'OZ');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "Address" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"company" text,
	"address1" text NOT NULL,
	"address2" text,
	"city" text NOT NULL,
	"state" text,
	"country" text NOT NULL,
	"postalCode" text NOT NULL,
	"phone" text,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"customerId" text
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY NOT NULL,
	"cartId" text NOT NULL,
	"productId" text NOT NULL,
	"variantId" text NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"email" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"expiresAt" timestamp(3),
	"customerId" text
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parentId" text,
	"image" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"phone" text,
	"acceptsMarketing" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_DiscountToOrder" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_DiscountToOrder_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "discounts" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text,
	"type" "DiscountType" NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"minimumAmount" numeric(10, 2),
	"isActive" boolean DEFAULT true NOT NULL,
	"appliesOnce" boolean DEFAULT false NOT NULL,
	"usageLimit" integer,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"startsAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"endsAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_FulfillmentItems" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_FulfillmentItems_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "fulfillments" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"trackingCompany" text,
	"trackingNumber" text,
	"trackingUrl" text,
	"status" "FulfillmentStatus" DEFAULT 'FULFILLED' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventories" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text,
	"inventoryQuantity" integer DEFAULT 0 NOT NULL,
	"price" text NOT NULL,
	"compareAtPrice" text,
	"costPrice" text,
	"weight" text,
	"weightUnit" "WeightUnit" DEFAULT 'KG' NOT NULL,
	"productId" text NOT NULL,
	"variantId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"productId" text,
	"categoryId" text
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"variantId" text NOT NULL,
	"title" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"totalPrice" numeric(10, 2) NOT NULL,
	"sku" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"orderNumber" serial NOT NULL,
	"email" text NOT NULL,
	"billingAddressId" text,
	"shippingAddressId" text,
	"subtotal" numeric(10, 2) NOT NULL,
	"shippingCost" numeric(10, 2) NOT NULL,
	"taxAmount" numeric(10, 2) NOT NULL,
	"totalDiscounts" numeric(10, 2) NOT NULL,
	"totalPrice" numeric(10, 2) NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"fulfillmentStatus" "FulfillmentStatus" DEFAULT 'UNFULFILLED' NOT NULL,
	"financialStatus" "FinancialStatus" DEFAULT 'PENDING' NOT NULL,
	"shippingLine" text,
	"note" text,
	"cancelReason" text,
	"cancelledAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"customerId" text
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"userId" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"staffId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"categoryId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProductImage" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"variantOptionId" text,
	"url" text NOT NULL,
	"alt" text,
	"position" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"productVariantId" text
);
--> statement-breakpoint
CREATE TABLE "product_option_values" (
	"id" text PRIMARY KEY NOT NULL,
	"optionId" text NOT NULL,
	"value" text NOT NULL,
	"position" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_options" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant_options" (
	"id" text PRIMARY KEY NOT NULL,
	"variantId" text NOT NULL,
	"optionValueId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"title" text NOT NULL,
	"requiresShipping" boolean DEFAULT true NOT NULL,
	"isTaxable" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"inventoryId" text
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "ProductStatus" DEFAULT 'DRAFT' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"position" text
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"kind" "TransactionKind" NOT NULL,
	"status" "TransactionStatus" NOT NULL,
	"gateway" text NOT NULL,
	"errorMessage" text,
	"paymentId" text,
	"reference" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp(3),
	"password" text,
	"firstName" text,
	"lastName" text,
	"role" "UserRole" DEFAULT 'CUSTOMER' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"emailVerificationToken" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_DiscountToOrder" ADD CONSTRAINT "_DiscountToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."discounts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_DiscountToOrder" ADD CONSTRAINT "_DiscountToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_FulfillmentItems" ADD CONSTRAINT "_FulfillmentItems_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."fulfillments"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_FulfillmentItems" ADD CONSTRAINT "_FulfillmentItems_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "meta_data" ADD CONSTRAINT "meta_data_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "public"."Address"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."Address"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."product_options"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_variant_options" ADD CONSTRAINT "product_variant_options_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_variant_options" ADD CONSTRAINT "product_variant_options_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "public"."product_option_values"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts" USING btree ("provider" text_ops,"providerAccountId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "cart_items_cartId_variantId_key" ON "cart_items" USING btree ("cartId" text_ops,"variantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "carts_userId_key" ON "carts" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_key" ON "categories" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "customers_userId_key" ON "customers" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "_DiscountToOrder_B_index" ON "_DiscountToOrder" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "_FulfillmentItems_B_index" ON "_FulfillmentItems" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "inventories_productId_key" ON "inventories" USING btree ("productId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "inventories_sku_key" ON "inventories" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "inventories_variantId_key" ON "inventories" USING btree ("variantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "meta_data_categoryId_key" ON "meta_data" USING btree ("categoryId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "meta_data_productId_key" ON "meta_data" USING btree ("productId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders" USING btree ("orderNumber" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets" USING btree ("token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "product_categories_productId_categoryId_key" ON "product_categories" USING btree ("productId" text_ops,"categoryId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "product_option_values_optionId_value_key" ON "product_option_values" USING btree ("optionId" text_ops,"value" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "product_options_productId_name_key" ON "product_options" USING btree ("productId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "product_variant_options_variantId_optionValueId_key" ON "product_variant_options" USING btree ("variantId" text_ops,"optionValueId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_key" ON "products" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions" USING btree ("sessionToken" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "staff_userId_key" ON "staff" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens" USING btree ("identifier" text_ops,"token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens" USING btree ("token" text_ops);