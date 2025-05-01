/**
 * This file contains TypeScript type definitions for database schema enums
 */

import { orderStatus, userRole } from "@/db/schema";
import { z } from "zod";

/**
 * Product Status type and enum values
 */

export enum ProductStatusEnum {
	DRAFT = "DRAFT",
	ACTIVE = "ACTIVE",
	PUBLISHED = "PUBLISHED",
	ARCHIVED = "ARCHIVED",
}

export const UserRoleEnum = z.enum(userRole.enumValues).Enum;
// export const ProductStatusEnum = z.enum(productStatus.enumValues).Enum;
export const OrderStatusEnum = z.enum(orderStatus.enumValues).Enum;
