import { getAllCategories } from "@/actions/inventory/categories"
import AccessoriesImage from "@/images/accessories.jpg"
import ApparelImage from "@/images/apparel.jpg"

export async function getStoreConfig() {
  const categories = (await getAllCategories()) ?? []

  return {
    categories: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      // You might want to add a proper image field to your categories table
      // For now, using a default image
      image:
        category.image ||
        (category.name === "Apparel" ? ApparelImage : AccessoriesImage),
    })),

    social: {
      x: "https://x.com/yourstore",
      facebook: "https://facebook.com/yourstore",
    },

    contact: {
      email: "support@yourstore.com",
      phone: "+1 (555) 111-4567",
      address: "123 Store Street, City, Country",
    },
  }
}

// Keep the type definition for static config reference
export type StoreConfig = {
  categories: {
    name: string
    slug: string
    image: any
  }[]
  social: {
    x: string
    facebook: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
}

// Remove the default export of static config
