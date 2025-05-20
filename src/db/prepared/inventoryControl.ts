// import { db } from "@/db";
// import { productVariants } from "@/db/schema";
// import { eq, sql } from "drizzle-orm";

// // Get current stock for a variant
// export async function getStock(variantId: string): Promise<number | null> {
//   const result = await db.select({ stock: productVariants.inventoryQuantity })
//     .from(productVariants)
//     .where(eq(productVariants.id, variantId));
//   return result[0]?.stock ?? null;
// }

// // Set stock for a variant
// export async function setStock(variantId: string, newStock: number): Promise<void> {
//   await db.update(productVariants)
//     .set({ stock: newStock })
//     .where(eq(productVariants.id, variantId));
// }

// // Increase stock for a variant
// export async function increaseStock(variantId: string, amount: number): Promise<void> {
//   await db.update(productVariants)
//     .set({ stock: sql`${productVariants.stock} + ${amount}` })
//     .where(eq(productVariants.id, variantId));
// }

// // Decrease stock for a variant
// export async function decreaseStock(variantId: string, amount: number): Promise<void> {
//   await db.update(productVariants)
//     .set({ stock: sql`${productVariants.stock} - ${amount}` })
//     .where(eq(productVariants.id, variantId));
// }

// // Check if enough stock is available
// export async function isStockAvailable(variantId: string, required: number): Promise<boolean> {
//   const stock = await getStock(variantId);
//   return stock !== null && stock >= required;
// }
