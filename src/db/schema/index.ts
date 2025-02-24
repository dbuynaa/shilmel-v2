import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { InferResultType } from "./utils"

// Enums
export const userRoleEnum = pgEnum("UserRole", ["USER", "ADMIN"])
export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
])
export const paymentStatusEnum = pgEnum("PaymentStatus", [
  "PENDING",
  "COMPLETED",
  "FAILED",
])

// Users
export const users = pgTable("User", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("USER").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: text("emailVerificationToken"),
  resetPasswordToken: text("resetPasswordToken").unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", {
    mode: "date",
  }),
  image: text("image"),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
})

// Addresses
export const addresses = pgTable("Address", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  postalCode: text("postalCode").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Categories
export const categories = pgTable("Category", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  image: text("image"),
  description: text("description"),
  parentId: text("parentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Products
export const products = pgTable("Product", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: text("categoryId")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Product Variants (Size, Color, Stock)
export const productVariants = pgTable("ProductVariant", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),

  size: text("size"),
  color: text("color"),
  material: text("material"),

  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

export const images = pgTable("Image", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  variantId: text("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("altText"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Carts
export const carts = pgTable("Cart", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Cart Items
export const cartItems = pgTable("CartItem", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  cartId: text("cartId")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  variantId: text("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
})

// Orders
export const orders = pgTable("Order", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shippingAddressId: text("shippingAddressId")
    .notNull()
    .references(() => addresses.id, { onDelete: "cascade" }),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  paymentMethod: text("paymentMethod").default("card").notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus")
    .default("PENDING")
    .notNull(),
  paymentId: text("paymentId").unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Order Items
export const orderItems = pgTable("OrderItem", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Payments
export const payments = pgTable("Payment", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("PENDING").notNull(),
  transactionId: text("transactionId").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})

// Relationships
// Users
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  carts: many(carts),
  addresses: many(addresses),
}))

// Addresses
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}))

// Categories
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products, {
    relationName: "CategoryToProduct",
  }),
  parent: one(categories, {
    relationName: "SubCategories",
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories, {
    relationName: "SubCategories",
  }),
}))

// Products
export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    relationName: "CategoryToProduct",
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems, { relationName: "CartItemToProduct" }),
  variants: many(productVariants, { relationName: "ProductToVariant" }),
  orderItems: many(orderItems, { relationName: "OrderItemToProduct" }),
}))

// Product Variants
export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      relationName: "ProductToVariant",
      fields: [productVariants.productId],
      references: [products.id],
    }),
    images: many(images, {
      relationName: "ImageToVariant",
    }),
    cartItems: many(cartItems),
    orderItems: many(orderItems),
  })
)

// Images
export const imagesRelations = relations(images, ({ one }) => ({
  variant: one(productVariants, {
    relationName: "ImageToVariant",
    fields: [images.variantId],
    references: [productVariants.id],
  }),
}))

// Carts
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    relationName: "CartToUser",
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

// Cart Items
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    relationName: "CartToCartItem",
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    relationName: "CartItemToProduct",
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}))

// Orders
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    relationName: "OrderToUser",
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems, { relationName: "OrderItemToOrder" }),

  payment: one(payments, {
    fields: [orders.paymentId],
    references: [payments.id],
  }),
}))

// Order Items
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    relationName: "OrderItemToOrder",
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    relationName: "OrderItemToProduct",
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))

// Payments
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

export type User = typeof users.$inferSelect
export type Product = typeof products.$inferSelect
export type ProudctWithVariants = InferResultType<
  "products",
  { category: true; variants: { with: { images: true } } }
>
// export type Cart = typeof carts.$inferSelect
export type Cart = InferResultType<
  "carts",
  { items: { with: { variant: true } } }
>
export type CartItem = InferResultType<
  "cartItems",
  { variant: { with: { images: true; product: true } } }
>
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type Category = typeof categories.$inferSelect
export type Address = typeof addresses.$inferSelect
