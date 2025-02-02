import {
  customType,
  pgEnum,
  pgTable,
  text,
  timestamp,
  integer,
  date,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const customBytes = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
  fromDriver(value: unknown) {
    if (Buffer.isBuffer(value)) return value;
    throw new Error("Expected Buffer");
  },
  toDriver(value: Buffer) {
    return value;
  },
});

export const userRoleEnum = pgEnum("UserRole", ["USER", "ADMIN"]);

export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const users = pgTable("User", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  name: text("name"),
  email: text("email"),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("USER").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", precision: 3 }),
  emailVerificationToken: text("emailVerificationToken"),
  resetPasswordToken: text("resetPasswordToken").unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", {
    mode: "date",
  }),
  image: text("image"),
  lastActivityDate: date("last_activity_date").defaultNow(),
});

export const products = pgTable("Product", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  discount: integer("discount"),
  categoryId: text("categoryId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
  workBranchId: text("workBranchId"),
});

export const imageColors = pgTable("ImageColor", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  color: text("color").notNull(),
  image: text("image").array().notNull(),
  productId: text("productId").notNull(),
});

export const customizations = pgTable("Customization", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  orderNumber: text("orderNumber").notNull(),
  logoPosition: text("logoPosition"),
  logoFile: text("logoFile"),
  notes: text("notes"),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
});

export const productMaterials = pgTable("ProductMaterial", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  material: text("material").notNull(),
  productId: text("productId").notNull(),
});

export const sizeQuantities = pgTable("SizeQuantity", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  size: text("size").notNull(),
  stock: integer("stock").notNull(),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
});

export const workBranches = pgTable("WorkBranch", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  parentId: text("parentId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
});

export const categories = pgTable("Category", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
});

// export const carts = pgTable("Cart", {
//   id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt( crypto.randomUUID())).unique(),
//   userId: text("userId").notNull(),
//   createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
//     .defaultNow()
//     .notNull(),
//   updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
// });

// export const cartItems = pgTable("CartItem", {
//   id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt( crypto.randomUUID())).unique(),
//   cartId: text("cartId").notNull(),
//   productId: text("productId"),
//   quantity: integer("quantity").notNull(),
//   size: text("size").notNull(),
//   color: text("color").notNull(),
// });

export const orders = pgTable("Order", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  totalAmount: integer("totalAmount").notNull(),
  paymentMethod: text("paymentMethod").default("card").notNull(),
  paymentStatus: text("paymentStatus").default("PENDING").notNull(),
  paymentId: text("paymentId"),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }).notNull(),
});

export const orderItems = pgTable("OrderItem", {
  id: serial("id").notNull().primaryKey().$defaultFn(() => parseInt(crypto.randomUUID())).unique(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  price: integer("price").notNull(),
  orderId: text("orderId").notNull(),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, (helpers) => ({
  order: helpers.many(orders, { relationName: "OrderToUser" }),
}));

export const productsRelations = relations(products, (helpers) => ({
  materials: helpers.many(productMaterials, {
    relationName: "ProductToProductMaterial",
  }),
  customization: helpers.one(customizations),
  sizes: helpers.many(sizeQuantities, {
    relationName: "ProductToSizeQuantity",
  }),
  imageColor: helpers.many(imageColors, {
    relationName: "ImageColorToProduct",
  }),
  category: helpers.one(categories, {
    relationName: "CategoryToProduct",
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: helpers.many(orderItems, { relationName: "OrderItemToProduct" }),
  // cartItems: helpers.many(cartItems, { relationName: "CartItemToProduct" }),
  WorkBranch: helpers.one(workBranches, {
    relationName: "ProductToWorkBranch",
    fields: [products.workBranchId],
    references: [workBranches.id],
  }),
}));

export const imageColorsRelations = relations(imageColors, (helpers) => ({
  product: helpers.one(products, {
    relationName: "ImageColorToProduct",
    fields: [imageColors.productId],
    references: [products.id],
  }),
}));

export const customizationsRelations = relations(customizations, (helpers) => ({
  product: helpers.one(products, {
    relationName: "CustomizationToProduct",
    fields: [customizations.productId],
    references: [products.id],
  }),
}));

export const productMaterialsRelations = relations(
  productMaterials,
  (helpers) => ({
    product: helpers.one(products, {
      relationName: "ProductToProductMaterial",
      fields: [productMaterials.productId],
      references: [products.id],
    }),
  })
);

export const sizeQuantitiesRelations = relations(sizeQuantities, (helpers) => ({
  product: helpers.one(products, {
    relationName: "ProductToSizeQuantity",
    fields: [sizeQuantities.productId],
    references: [products.id],
  }),
}));

export const workBranchesRelations = relations(workBranches, (helpers) => ({
  products: helpers.many(products, { relationName: "ProductToWorkBranch" }),
  parent: helpers.one(workBranches, {
    relationName: "SubWorkBranches",
    fields: [workBranches.parentId],
    references: [workBranches.id],
  }),
  children: helpers.many(workBranches, { relationName: "SubWorkBranches" }),
}));

export const categoriesRelations = relations(categories, (helpers) => ({
  products: helpers.many(products, { relationName: "CategoryToProduct" }),
}));

// export const cartsRelations = relations(carts, (helpers) => ({
//   items: helpers.many(cartItems, { relationName: "CartToCartItem" }),
// }));

// export const cartItemsRelations = relations(cartItems, (helpers) => ({
//   cart: helpers.one(carts, {
//     relationName: "CartToCartItem",
//     fields: [cartItems.cartId],
//     references: [carts.id],
//   }),
//   product: helpers.one(products, {
//     relationName: "CartItemToProduct",
//     fields: [cartItems.productId],
//     references: [products.id],
//   }),
// }));

export const ordersRelations = relations(orders, (helpers) => ({
  items: helpers.many(orderItems, { relationName: "OrderToOrderItem" }),
  orderedBy: helpers.one(users, {
    relationName: "OrderToUser",
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, (helpers) => ({
  order: helpers.one(orders, {
    relationName: "OrderToOrderItem",
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: helpers.one(products, {
    relationName: "OrderItemToProduct",
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductMaterial = typeof productMaterials.$inferSelect;
export type SizeQuantity = typeof sizeQuantities.$inferSelect;
export type ImageColor = typeof imageColors.$inferSelect;
export type Customization = typeof customizations.$inferSelect;
// export type Cart = typeof carts.$inferSelect;
// export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type WorkBranch = typeof workBranches.$inferSelect;
