"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { images, products, productVariants } from "@/db/schema"
import type { itemSchema } from "@/validations/inventory"
import { eq } from "drizzle-orm"
import type { z } from "zod"

// export async function addItem(
//   input: z.infer<typeof itemSchema>
// ): Promise<"success" | "error"> {
//   try {
//     // Create a new object with required properties and exclude 'category'
//     const { category, ...itemData } = input

//     // Insert the item with the generated slug and categoryId
//     const product = await db
//       .insert(products)
//       .values({
//         ...itemData,
//         slug: input.name.toLowerCase().replace(/\s+/g, "-"),
//         categoryId: input.category, // Map category to categoryId
//       })
//       .returning()

//     const variant = await db
//       .insert(productVariants)
//       .values({
//         productId: product[0].id,
//         size: input.size,
//         color: input.color,
//         sku: `${input.name.substring(0, 3).toUpperCase()}-${input.color?.substring(0, 3).toUpperCase()}-${input.size?.substring(0, 2).toUpperCase()}-${Math.floor(
//           Math.random() * 1000
//         )
//           .toString()
//           .padStart(3, "0")}`,
//         material: input.material,
//         stock: input.quantity,
//       })
//       .returning()
//     if (input.images && input.images.length > 0) {
//       await db.insert(images).values(
//         input.images.map((image) => ({
//           url: image.url,
//           variantId: variant[0].id,
//         }))
//       )
//     }

//     return "success"
//   } catch (error) {
//     console.error("Error adding item:", error)
//     return "error"
//   }
// }

export async function addItem(
  input: z.infer<typeof itemSchema>
): Promise<"success" | "error"> {
  try {
    // Insert the base product
    const product = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description,
        price: input.price,
        slug: input.name.toLowerCase().replace(/\s+/g, "-"),
        categoryId: input.category, // Map category to categoryId
      })
      .returning()

    // Insert all variants
    for (const variant of input.variants) {
      // Insert variant
      const newVariant = await db
        .insert(productVariants)
        .values({
          productId: product[0].id,
          size: variant.size,
          color: variant.color,
          sku: `${input.name.substring(0, 3).toUpperCase()}-${variant.color?.substring(0, 3).toUpperCase()}-${variant.size?.substring(0, 2).toUpperCase()}-${Math.floor(
            Math.random() * 1000
          )
            .toString()
            .padStart(3, "0")}`,
          material: variant.material,
          stock: variant.stock,
        })
        .returning()

      // Insert images
      for (const image of variant.images ?? []) {
        await db.insert(images).values({
          url: (image as { url?: string }).url ?? "",
          variantId: newVariant[0].id,
        })
      }
    }

    revalidatePath("/inventory/items")
    return "success"
  } catch (error) {
    console.error("Error adding product:", error)
    return "error"
  }
}

export async function checkItem(input: {
  name: string
  id?: string
}): Promise<boolean> {
  noStore()
  try {
    const existingItem = await db
      .select()
      .from(products)
      .where(
        input.id
          ? eq(products.name, input.name) && eq(products.id, input.id)
          : eq(products.name, input.name)
      )
      .limit(1)

    return existingItem.length > 0
  } catch (error) {
    console.error("Error checking item:", error)
    return false
  }
}

export async function deleteItem(input: {
  id: string
}): Promise<"success" | "error"> {
  try {
    await db.delete(products).where(eq(products.id, input.id))
    return "success"
  } catch (error) {
    console.error("Error deleting item:", error)
    return "error"
  }
}

export async function getItems() {
  noStore()
  try {
    const items = await db.select().from(products)
    return items
  } catch (error) {
    console.error("Error fetching items:", error)
    return []
  }
}

export async function getItemById(id: string) {
  noStore()
  try {
    const item = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        variants: {
          with: {
            images: true,
          },
        },
      },
    })

    return item ?? null
  } catch (error) {
    console.error("Error fetching item:", error)
    return null
  }
}

export async function updateItem(
  id: string,
  input: z.infer<typeof itemSchema>
): Promise<"success" | "error"> {
  try {
    // Update the base product
    await db
      .update(products)
      .set({
        name: input.name,
        description: input.description,
        price: input.price,
        slug: input.name.toLowerCase().replace(/\s+/g, "-"),
        categoryId: input.category,
      })
      .where(eq(products.id, id))

    // Get existing variants
    const existingVariants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id))

    // Delete existing variants and their images
    for (const variant of existingVariants) {
      await db.delete(images).where(eq(images.variantId, variant.id))
    }
    await db.delete(productVariants).where(eq(productVariants.productId, id))

    // Insert new variants
    for (const variant of input.variants) {
      // Insert variant
      const newVariant = await db
        .insert(productVariants)
        .values({
          productId: id,
          size: variant.size,
          color: variant.color,
          sku: `${input.name.substring(0, 3).toUpperCase()}-${variant.color?.substring(0, 3).toUpperCase()}-${variant.size?.substring(0, 2).toUpperCase()}-${Math.floor(
            Math.random() * 1000
          )
            .toString()
            .padStart(3, "0")}`,
          material: variant.material,
          stock: variant.stock,
        })
        .returning()

      // Insert images
      for (const image of variant.images ?? []) {
        await db.insert(images).values({
          url: (image as { url?: string }).url ?? "",
          variantId: newVariant[0].id,
        })
      }
    }

    revalidatePath("/inventory/items")
    return "success"
  } catch (error) {
    console.error("Error updating product:", error)
    return "error"
  }
}

export async function getImagesByVariantId(slug: string) {
  noStore()
  try {
    const variantImages = await db
      .select()
      .from(images)
      .where(eq(images.variantId, slug))
    return variantImages
  } catch (error) {
    console.error("Error fetching images:", error)
    return []
  }
}

export async function deleteImage(imageId: string) {
  try {
    await db.delete(images).where(eq(images.id, imageId))
    return "success"
  } catch (error) {
    console.error("Error deleting image:", error)
    return "error"
  }
}
