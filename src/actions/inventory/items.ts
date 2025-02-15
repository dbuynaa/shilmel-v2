"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import { extendedItemSchema } from "@/validations/inventory"
import { eq } from "drizzle-orm"
import type { z } from "zod"

export async function addItem(
  rawInput: z.infer<typeof extendedItemSchema>
): Promise<string> {
  const input = extendedItemSchema.parse(rawInput)

  console.log("Adding item to the database ...")
  console.log(input)
  // db.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Item added to the database")
      resolve("success")
    }, 1000)
  })
}

export async function checkItem(input: {
  name: string
  id?: string
}): Promise<boolean> {
  noStore()
  console.log("Received data:", input.name, input.id)
  console.log("Checking item in the database ...")

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Item not in a database")
      resolve(false)
    }, 1000)
  })
}

export async function deleteItem(rawInput: {
  id: string
}): Promise<"invalid-input" | "success" | "error"> {
  // const validatedInput = deleteCategorySchema.safeParse(rawInput)
  // if (!validatedInput.success) return "invalid-input"

  try {
    const deletedCategory = await db
      .delete(products)
      .where(eq(products.id, rawInput.id))

    return deletedCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting category")
  }
}
