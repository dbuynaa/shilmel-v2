import type {
	categories,
	metaData,
	productCategories,
	productImage,
	productOptionValues,
	productOptions,
	productVariantOptions,
	productVariants,
	products,
	users,
} from "@/db/schema";
import type { InferResultType } from "@/db/types/InferResult";
// import type { InferResultType } from "@/db/types/InferResult";

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ProductImage = typeof productImage.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type ProductOption = typeof productOptions.$inferSelect;
export type ProductOptionWithValues = InferResultType<"productOptions", { values: true }>;
export type ProductWithVariants = InferResultType<
	"products",
	{ productImages: true; productVariants: { with: { productImages: true } } }
>;
export type ProductWithImages = InferResultType<"products", { productImages: true }>;
export type ProductOptionValue = typeof productOptionValues.$inferSelect;
export type ProductVariantOptions = typeof productVariantOptions.$inferSelect;
export type MetaData = typeof metaData.$inferSelect;
