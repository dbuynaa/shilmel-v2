import { db } from "@/db" // Ensure this points to your database connection
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { reset, seed } from "drizzle-seed"

import * as schema from "./schema" // Adjust the path to your schema definitions

async function main() {
  const discounts = [0.05, 0.15, 0.2, 0.25]
  // const sql = neon(
  //   "postgresql://neondb_owner:npg_2gldYKQ4iLUk@ep-tight-pine-a1x4sscy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  // )

  // const db = drizzle(sql, { schema })

  await reset(db, schema)

  await seed(db, schema, { count: 10 }).refine((f) => ({
    users: {
      columns: {
        id: f.string({ isUnique: true }),
        name: f.string(),
        email: f.email(),
        password: f.string(),
        role: "USER",
        emailVerified: f.boolean(),
        emailVerificationToken: f.string(),
        resetPasswordToken: f.string(),
        resetPasswordTokenExpiry: f.date(),
        image: f.string(),
        lastActivityDate: f.date(),
      },
    },
    addresses: {
      columns: {
        id: f.string({ isUnique: true }),
        userId: f.string(),
        street: f.string(),
        city: f.string(),
        state: f.string(),
        postalCode: f.string(),
        country: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    categories: {
      columns: {
        id: f.string({ isUnique: true }),
        name: f.string(),
        description: f.string(),
        parentId: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    products: {
      columns: {
        id: f.string({ isUnique: true }),
        name: f.string(),
        description: f.string(),
        price: f.weightedRandom([
          {
            weight: 0.5,
            value: f.int({ minValue: 3, maxValue: 300 }),
          },
          {
            weight: 0.5,
            value: f.number({ minValue: 3, maxValue: 300, precision: 100 }),
          },
        ]),
        discount: f.weightedRandom([
          { weight: 0.5, value: f.valuesFromArray({ values: discounts }) },
          { weight: 0.5, value: f.default({ defaultValue: 0 }) },
        ]),
        categoryId: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    productVariants: {
      columns: {
        id: f.string({ isUnique: true }),
        productId: f.string(),
        size: f.string(),
        color: f.string(),
        material: f.string(),
        stock: f.int({ minValue: 0, maxValue: 125 }),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    images: {
      columns: {
        id: f.string({ isUnique: true }),
        variantId: f.string(),
        url: f.string(),
        altText: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    carts: {
      columns: {
        id: f.string({ isUnique: true }),
        userId: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    cartItems: {
      columns: {
        id: f.string({ isUnique: true }),
        cartId: f.string(),
        variantId: f.string(),
        quantity: f.int({ minValue: 1, maxValue: 10 }),
      },
    },
    orders: {
      columns: {
        id: f.string({ isUnique: true }),
        userId: f.string(),
        shippingAddressId: f.string(),
        paymentMethod: f.string(),
        paymentId: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    orderItems: {
      columns: {
        id: f.string({ isUnique: true }),
        orderId: f.string(),
        variantId: f.string(),
        productId: f.string(),
        quantity: f.int({ minValue: 1, maxValue: 10 }),
        price: f.int({ minValue: 1, maxValue: 100 }),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
    },
    payments: {
      columns: {
        id: f.string({ isUnique: true }),
        orderId: f.string(),
        amount: f.int({ minValue: 1, maxValue: 100 }),
        transactionId: f.string({ isUnique: true }),
        createdAt: f.date(),
      },
    },
  }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
