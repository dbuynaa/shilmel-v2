import { db } from "@/db"
// import { db } from "."
import * as schema from "@/db/schema"
import { categories, products, users } from "@/db/schema"
import { neon } from "@neondatabase/serverless"
import bcryptjs from "bcryptjs"
import { drizzle } from "drizzle-orm/neon-http"

async function main() {
  console.log("🌱 Seeding database...")
  const sql = neon(
    "postgresql://neondb_owner:npg_2gldYKQ4iLUk@ep-tight-pine-a1x4sscy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  )

  const db = drizzle(sql, { schema })

  // Delete existing data
  await db.delete(products)
  await db.delete(categories)
  await db.delete(users)

  // Create admin userschema
  const hashedPassword = await bcryptjs.hash("password123", 10)
  const [adminUser] = await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    })
    .returning()

  console.log("👤 Created admin user:", adminUser.email)

  // Create categories
  const categoryData = [
    { name: "Apparel", description: "Clothing and fashion items" },
    { name: "Accessories", description: "Fashion accessories and jewelry" },
    { name: "Electronics", description: "Electronic devices and gadgets" },
    { name: "Home & Living", description: "Home decor and living essentials" },
  ]

  const createdCategories = await db
    .insert(categories)
    .values(
      categoryData.map((cat) => ({
        name: cat.name.toLowerCase(),
        slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
        description: cat.description,
        icon: "default-icon", // You might want to update this with actual icons
      }))
    )
    .returning()

  console.log(
    "📁 Created categories:",
    createdCategories.map((c) => c.name)
  )

  // Create products
  const productData = [
    {
      name: "Classic T-Shirt",
      description: "A comfortable cotton t-shirt for everyday wear",
      price: 2499, // $24.99
      categoryId: createdCategories[0].id, // Apparel
      variants: [
        {
          size: "S",
          color: "Blue",
          stock: 10,
        },
        {
          size: "M",
          color: "Red",
          stock: 15,
        },
        {
          size: "L",
          color: "Green",
          stock: 8,
        },
      ],
    },
    {
      name: "Designer Watch",
      description: "Elegant timepiece with premium build quality",
      price: 19999, // $199.99
      categoryId: createdCategories[1].id, // Accessories
    },
    {
      name: "Wireless Earbuds",
      description: "High-quality wireless earbuds with noise cancellation",
      price: 14999, // $149.99
      categoryId: createdCategories[2].id, // Electronics
    },
    {
      name: "Decorative Pillow",
      description: "Soft and stylish pillow for your home",
      price: 3999, // $39.99
      categoryId: createdCategories[3].id, // Home & Living
    },
    {
      name: "Denim Jeans",
      description: "Classic fit denim jeans with premium quality",
      price: 5999, // $59.99
      categoryId: createdCategories[0].id, // Apparel
    },
    {
      name: "Leather Wallet",
      description: "Genuine leather wallet with multiple card slots",
      price: 4499, // $44.99
      categoryId: createdCategories[1].id, // Accessories
    },
    {
      name: "Smart Speaker",
      description: "Voice-controlled smart speaker with premium sound",
      price: 9999, // $99.99
      categoryId: createdCategories[2].id, // Electronics
    },
    {
      name: "Table Lamp",
      description: "Modern design table lamp with adjustable brightness",
      price: 7999, // $79.99
      categoryId: createdCategories[3].id, // Home & Living
    },
  ]

  const now = new Date()
  const createdProducts = await db
    .insert(products)
    .values(
      productData.map((prod) => ({
        name: prod.name,
        description: prod.description,
        price: prod.price.toString(),
        slug: prod.name.toLowerCase().replace(/\s+/g, "-"),
        categoryId: prod.categoryId,
        createdAt: now,
        updatedAt: now,
      }))
    )
    .returning()

  console.log(
    "📦 Created products:",
    createdProducts.map((p) => p.name)
  )

  console.log("✅ Seeding completed!")
}

main().catch((err) => {
  console.error("❌ Error seeding database:", err)
  process.exit(1)
})
