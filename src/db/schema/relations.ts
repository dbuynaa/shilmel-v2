import { relations } from "drizzle-orm";
import {
	accounts,
	addresses,
	cartItems,
	carts,
	categories,
	customers,
	discountToOrder,
	discounts,
	fulfillmentItems,
	fulfillments,
	metaData,
	orderItems,
	orders,
	passwordResets,
	permissions,
	productCategories,
	productImage,
	productOptionValues,
	productOptions,
	productVariantOptions,
	productVariants,
	products,
	sessions,
	staff,
	transactions,
	users,
} from "./schema";

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	passwordResets: many(passwordResets),
	staff: one(staff),
	customer: one(customers),
	carts: many(carts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
	user: one(users, {
		fields: [passwordResets.userId],
		references: [users.id],
	}),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
	user: one(users, {
		fields: [staff.userId],
		references: [users.id],
	}),
	permissions: many(permissions),
}));

export const permissionsRelations = relations(permissions, ({ one }) => ({
	staff: one(staff, {
		fields: [permissions.staffId],
		references: [staff.id],
	}),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
	user: one(users, {
		fields: [customers.userId],
		references: [users.id],
	}),
	addresses: many(addresses),
	orders: many(orders),
	carts: many(carts),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
	product: one(products, {
		fields: [productImage.productId],
		references: [products.id],
	}),
	productVariant: one(productVariants, {
		fields: [productImage.productVariantId],
		references: [productVariants.id],
	}),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
	productImages: many(productImage),
	productVariants: many(productVariants),
	productCategories: many(productCategories),
	productOptions: many(productOptions),
	metaData: many(metaData),
	orderItems: many(orderItems),
	cartItems: many(cartItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
	productImages: many(productImage),
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id],
	}),
	optionValues: many(productVariantOptions),
	orderItems: many(orderItems),
	cartItems: many(cartItems),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	category: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "categories_parentId_categories_id",
	}),
	categories: many(categories, {
		relationName: "categories_parentId_categories_id",
	}),
	productCategories: many(productCategories),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
	product: one(products, {
		fields: [productCategories.productId],
		references: [products.id],
	}),
	category: one(categories, {
		fields: [productCategories.categoryId],
		references: [categories.id],
	}),
}));

// export const inventoriesRelations = relations(inventories, ({ one }) => ({
// 	product: one(products, {
// 		fields: [inventories.productId],
// 		references: [products.id],
// 	}),
// 	productVariant: one(productVariants, {
// 		fields: [inventories.variantId],
// 		references: [productVariants.id],
// 	}),
// }));

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
	product: one(products, {
		fields: [productOptions.productId],
		references: [products.id],
	}),
	values: many(productOptionValues),
}));

export const productOptionValuesRelations = relations(productOptionValues, ({ one, many }) => ({
	productOption: one(productOptions, {
		fields: [productOptionValues.optionId],
		references: [productOptions.id],
	}),
	productVariantOptions: many(productVariantOptions),
}));

export const productVariantOptionsRelations = relations(productVariantOptions, ({ one }) => ({
	productVariant: one(productVariants, {
		fields: [productVariantOptions.variantId],
		references: [productVariants.id],
	}),
	productOptionValue: one(productOptionValues, {
		fields: [productVariantOptions.optionValueId],
		references: [productOptionValues.id],
	}),
}));

export const metaDataRelations = relations(metaData, ({ one }) => ({
	product: one(products, {
		fields: [metaData.productId],
		references: [products.id],
	}),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
	customer: one(customers, {
		fields: [addresses.customerId],
		references: [customers.id],
	}),
	orders_billingAddressId: many(orders, {
		relationName: "orders_billingAddressId_address_id",
	}),
	orders_shippingAddressId: many(orders, {
		relationName: "orders_shippingAddressId_address_id",
	}),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
	address_billingAddressId: one(addresses, {
		fields: [orders.billingAddressId],
		references: [addresses.id],
		relationName: "orders_billingAddressId_address_id",
	}),
	address_shippingAddressId: one(addresses, {
		fields: [orders.shippingAddressId],
		references: [addresses.id],
		relationName: "orders_shippingAddressId_address_id",
	}),
	customer: one(customers, {
		fields: [orders.customerId],
		references: [customers.id],
	}),
	orderItems: many(orderItems),
	transactions: many(transactions),
	fulfillments: many(fulfillments),
	discountToOrders: many(discountToOrder),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
	productVariant: one(productVariants, {
		fields: [orderItems.variantId],
		references: [productVariants.id],
	}),
	fulfillmentItems: many(fulfillmentItems),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	order: one(orders, {
		fields: [transactions.orderId],
		references: [orders.id],
	}),
}));

export const fulfillmentsRelations = relations(fulfillments, ({ one, many }) => ({
	order: one(orders, {
		fields: [fulfillments.orderId],
		references: [orders.id],
	}),
	fulfillmentItems: many(fulfillmentItems),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(users, {
		fields: [carts.userId],
		references: [users.id],
	}),
	customer: one(customers, {
		fields: [carts.customerId],
		references: [customers.id],
	}),
	cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id],
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id],
	}),
	productVariant: one(productVariants, {
		fields: [cartItems.variantId],
		references: [productVariants.id],
	}),
}));

export const fulfillmentItemsRelations = relations(fulfillmentItems, ({ one }) => ({
	fulfillment: one(fulfillments, {
		fields: [fulfillmentItems.a],
		references: [fulfillments.id],
	}),
	orderItem: one(orderItems, {
		fields: [fulfillmentItems.b],
		references: [orderItems.id],
	}),
}));

export const discountToOrderRelations = relations(discountToOrder, ({ one }) => ({
	discount: one(discounts, {
		fields: [discountToOrder.a],
		references: [discounts.id],
	}),
	order: one(orders, {
		fields: [discountToOrder.b],
		references: [orders.id],
	}),
}));

export const discountsRelations = relations(discounts, ({ many }) => ({
	discountToOrders: many(discountToOrder),
}));
