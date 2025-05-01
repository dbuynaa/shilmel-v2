import { sql } from "drizzle-orm";
import {
	boolean,
	decimal,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const discountType = pgEnum("DiscountType", ["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]);
export const financialStatus = pgEnum("FinancialStatus", [
	"PENDING",
	"AUTHORIZED",
	"PARTIALLY_PAID",
	"PAID",
	"PARTIALLY_REFUNDED",
	"REFUNDED",
	"VOIDED",
]);
export const fulfillmentStatus = pgEnum("FulfillmentStatus", [
	"UNFULFILLED",
	"PARTIALLY_FULFILLED",
	"FULFILLED",
	"RESTOCKED",
]);
export const orderStatus = pgEnum("OrderStatus", [
	"PENDING",
	"PROCESSING",
	"COMPLETED",
	"CANCELLED",
	"REFUNDED",
	"FAILED",
]);
export const productStatus = pgEnum("ProductStatus", ["DRAFT", "ACTIVE", "ARCHIVED", "PUBLISHED"]);
export const transactionKind = pgEnum("TransactionKind", [
	"SALE",
	"CAPTURE",
	"AUTHORIZATION",
	"VOID",
	"REFUND",
]);
export const transactionStatus = pgEnum("TransactionStatus", ["PENDING", "SUCCESS", "FAILURE", "ERROR"]);
export const userRole = pgEnum("UserRole", ["ADMIN", "STAFF", "CUSTOMER"]);
export const weightUnit = pgEnum("WeightUnit", ["KG", "G", "LB", "OZ"]);

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: "string" }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text().notNull(),
		token: text().notNull(),
		expires: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("verification_tokens_identifier_token_key").using(
			"btree",
			table.identifier.asc().nullsLast().op("text_ops"),
			table.token.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("verification_tokens_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
	],
);

export const users = pgTable(
	"users",
	{
		id: text().primaryKey().notNull(),
		email: text().notNull(),
		emailVerified: timestamp({ precision: 3, mode: "string" }),
		password: text(),
		firstName: text(),
		lastName: text(),
		role: userRole().default("CUSTOMER").notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
		isActive: boolean().default(true).notNull(),
		emailVerificationToken: text(),
		resetPasswordToken: text(),
		resetPasswordTokenExpiry: timestamp({ precision: 3, mode: "string" }),
	},
	(table) => [uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops"))],
);

export const accounts = pgTable(
	"accounts",
	{
		id: text().primaryKey().notNull(),
		userId: text().notNull(),
		type: text().notNull(),
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refreshToken: text("refresh_token"),
		accessToken: text("access_token"),
		expiresAt: integer("expires_at"),
		tokenType: text("token_type"),
		scope: text(),
		idToken: text("id_token"),
		sessionState: text("session_state"),
	},
	(table) => [
		uniqueIndex("accounts_provider_providerAccountId_key").using(
			"btree",
			table.provider.asc().nullsLast().op("text_ops"),
			table.providerAccountId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const sessions = pgTable(
	"sessions",
	{
		id: text().primaryKey().notNull(),
		sessionToken: text().notNull(),
		userId: text().notNull(),
		expires: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("sessions_sessionToken_key").using(
			"btree",
			table.sessionToken.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const passwordResets = pgTable(
	"password_resets",
	{
		id: text().primaryKey().notNull(),
		token: text().notNull(),
		userId: text().notNull(),
		expiresAt: timestamp({ precision: 3, mode: "string" }).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	},
	(table) => [
		uniqueIndex("password_resets_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "password_resets_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const staff = pgTable(
	"staff",
	{
		id: text().primaryKey().notNull(),
		userId: text().notNull(),
		position: text(),
	},
	(table) => [
		uniqueIndex("staff_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "staff_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const permissions = pgTable(
	"permissions",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		staffId: text().notNull(),
	},
	(table) => [
		uniqueIndex("permissions_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.id],
			name: "permissions_staffId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const customers = pgTable(
	"customers",
	{
		id: text().primaryKey().notNull(),
		userId: text().notNull(),
		phone: text(),
		acceptsMarketing: boolean().default(false).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("customers_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "customers_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const products = pgTable(
	"products",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		status: productStatus().default("DRAFT").notNull(),
		sku: text(),
		price: decimal({ precision: 10, scale: 2 }).notNull(),
		compareAtPrice: decimal({ precision: 10, scale: 2 }),
		costPrice: decimal({ precision: 10, scale: 2 }),
		weight: decimal({ precision: 10, scale: 2 }),
		weightUnit: weightUnit().default("KG").notNull(),
		stock: integer().default(0).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [uniqueIndex("products_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const productImage = pgTable(
	"ProductImage",
	{
		id: text().primaryKey().notNull(),
		productId: text().notNull(),
		variantOptionId: text(),
		url: text().notNull(),
		alt: text(),
		position: integer().default(0).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		productVariantId: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "ProductImage_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariants.id],
			name: "ProductImage_productVariantId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const productVariants = pgTable(
	"product_variants",
	{
		id: text().primaryKey().notNull(),
		productId: text().notNull(),
		title: text().notNull(),
		sku: text(),
		stock: integer().default(0).notNull(),
		price: decimal({ precision: 10, scale: 2 }).notNull(),
		compareAtPrice: decimal({ precision: 10, scale: 2 }),
		costPrice: decimal({ precision: 10, scale: 2 }),
		weight: decimal({ precision: 10, scale: 2 }),
		weightUnit: weightUnit().default("KG").notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_variants_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const categories = pgTable(
	"categories",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		parentId: text(),
		image: text(),
		isActive: boolean().default(true).notNull(),
		position: integer().default(1).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("categories_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "categories_parentId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const productCategories = pgTable(
	"product_categories",
	{
		id: text().primaryKey().notNull(),
		productId: text().notNull(),
		categoryId: text().notNull(),
	},
	(table) => [
		uniqueIndex("product_categories_productId_categoryId_key").using(
			"btree",
			table.productId.asc().nullsLast().op("text_ops"),
			table.categoryId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_categories_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "product_categories_categoryId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const productOptions = pgTable(
	"product_options",
	{
		id: text().primaryKey().notNull(),
		productId: text().notNull(),
		name: text().notNull(),
		position: integer().default(1),
	},
	(table) => [
		uniqueIndex("product_options_productId_name_key").using(
			"btree",
			table.productId.asc().nullsLast().op("text_ops"),
			table.name.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_options_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const productOptionValues = pgTable(
	"product_option_values",
	{
		id: text().primaryKey().notNull(),
		optionId: text().notNull(),
		value: text().notNull(),
		position: integer().default(1).notNull(),
	},
	(table) => [
		uniqueIndex("product_option_values_optionId_value_key").using(
			"btree",
			table.optionId.asc().nullsLast().op("text_ops"),
			table.value.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.optionId],
			foreignColumns: [productOptions.id],
			name: "product_option_values_optionId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const productVariantOptions = pgTable(
	"product_variant_options",
	{
		id: text().primaryKey().notNull(),
		variantId: text().notNull(),
		optionValueId: text().notNull(),
	},
	(table) => [
		uniqueIndex("product_variant_options_variantId_optionValueId_key").using(
			"btree",
			table.variantId.asc().nullsLast().op("text_ops"),
			table.optionValueId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "product_variant_options_variantId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.optionValueId],
			foreignColumns: [productOptionValues.id],
			name: "product_variant_options_optionValueId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const metaData = pgTable(
	"meta_data",
	{
		id: text().primaryKey().notNull(),
		title: text(),
		description: text(),
		productId: text(),
		categoryId: text(),
	},
	(table) => [
		uniqueIndex("meta_data_categoryId_key").using("btree", table.categoryId.asc().nullsLast().op("text_ops")),
		uniqueIndex("meta_data_productId_key").using("btree", table.productId.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "meta_data_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const address = pgTable(
	"Address",
	{
		id: text().primaryKey().notNull(),
		userId: text().notNull(),
		firstName: text().notNull(),
		lastName: text().notNull(),
		company: text(),
		address1: text().notNull(),
		address2: text(),
		city: text().notNull(),
		state: text(),
		country: text().notNull(),
		postalCode: text().notNull(),
		phone: text(),
		isDefault: boolean().default(false).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
		customerId: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "Address_customerId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const orders = pgTable(
	"orders",
	{
		id: text().primaryKey().notNull(),
		orderNumber: serial().notNull(),
		email: text().notNull(),
		billingAddressId: text(),
		shippingAddressId: text(),
		subtotal: decimal({ precision: 10, scale: 2 }).notNull(),
		shippingCost: decimal({ precision: 10, scale: 2 }).notNull(),
		taxAmount: decimal({ precision: 10, scale: 2 }).notNull(),
		totalDiscounts: decimal({ precision: 10, scale: 2 }).notNull(),
		totalPrice: decimal({ precision: 10, scale: 2 }).notNull(),
		status: orderStatus().default("PENDING").notNull(),
		fulfillmentStatus: fulfillmentStatus().default("UNFULFILLED").notNull(),
		financialStatus: financialStatus().default("PENDING").notNull(),
		shippingLine: text(),
		note: text(),
		cancelReason: text(),
		cancelledAt: timestamp({ precision: 3, mode: "string" }),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
		customerId: text(),
	},
	(table) => [
		uniqueIndex("orders_orderNumber_key").using("btree", table.orderNumber.asc().nullsLast().op("int4_ops")),
		foreignKey({
			columns: [table.billingAddressId],
			foreignColumns: [address.id],
			name: "orders_billingAddressId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.shippingAddressId],
			foreignColumns: [address.id],
			name: "orders_shippingAddressId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "orders_customerId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const orderItems = pgTable(
	"order_items",
	{
		id: text().primaryKey().notNull(),
		orderId: text().notNull(),
		productId: text().notNull(),
		variantId: text().notNull(),
		title: text().notNull(),
		quantity: integer().notNull(),
		price: decimal({ precision: 10, scale: 2 }).notNull(),
		totalPrice: decimal({ precision: 10, scale: 2 }).notNull(),
		sku: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_orderId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("restrict"),
		foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "order_items_variantId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("restrict"),
	],
);

export const transactions = pgTable(
	"transactions",
	{
		id: text().primaryKey().notNull(),
		orderId: text().notNull(),
		amount: decimal({ precision: 10, scale: 2 }).notNull(),
		kind: transactionKind().notNull(),
		status: transactionStatus().notNull(),
		gateway: text().notNull(),
		errorMessage: text(),
		paymentId: text(),
		reference: text(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "transactions_orderId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const fulfillments = pgTable(
	"fulfillments",
	{
		id: text().primaryKey().notNull(),
		orderId: text().notNull(),
		trackingCompany: text(),
		trackingNumber: text(),
		trackingUrl: text(),
		status: fulfillmentStatus().default("FULFILLED").notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "fulfillments_orderId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const carts = pgTable(
	"carts",
	{
		id: text().primaryKey().notNull(),
		userId: text(),
		email: text(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
		expiresAt: timestamp({ precision: 3, mode: "string" }),
		customerId: text(),
	},
	(table) => [
		uniqueIndex("carts_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "carts_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "carts_customerId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const cartItems = pgTable(
	"cart_items",
	{
		id: text().primaryKey().notNull(),
		cartId: text().notNull(),
		productId: text().notNull(),
		variantId: text().notNull(),
		quantity: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("cart_items_cartId_variantId_key").using(
			"btree",
			table.cartId.asc().nullsLast().op("text_ops"),
			table.variantId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.cartId],
			foreignColumns: [carts.id],
			name: "cart_items_cartId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_items_productId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "cart_items_variantId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const discounts = pgTable(
	"discounts",
	{
		id: text().primaryKey().notNull(),
		code: text(),
		type: discountType().notNull(),
		value: decimal({ precision: 10, scale: 2 }).notNull(),
		minimumAmount: decimal({ precision: 10, scale: 2 }),
		isActive: boolean().default(true).notNull(),
		appliesOnce: boolean().default(false).notNull(),
		usageLimit: integer(),
		usageCount: integer().default(0).notNull(),
		startsAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		endsAt: timestamp({ precision: 3, mode: "string" }),
		createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [uniqueIndex("discounts_code_key").using("btree", table.code.asc().nullsLast().op("text_ops"))],
);

export const fulfillmentItems = pgTable(
	"_FulfillmentItems",
	{
		a: text("A").notNull(),
		b: text("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [fulfillments.id],
			name: "_FulfillmentItems_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [orderItems.id],
			name: "_FulfillmentItems_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({ columns: [table.a, table.b], name: "_FulfillmentItems_AB_pkey" }),
	],
);

export const discountToOrder = pgTable(
	"_DiscountToOrder",
	{
		a: text("A").notNull(),
		b: text("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [discounts.id],
			name: "_DiscountToOrder_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [orders.id],
			name: "_DiscountToOrder_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({ columns: [table.a, table.b], name: "_DiscountToOrder_AB_pkey" }),
	],
);
