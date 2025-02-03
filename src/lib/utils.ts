import { env } from "@/env"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`
}

export function isArrayOfFiles(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date))
}

export function invariant(condition: any, message?: string): asserts condition {
  if (condition) {
    return
  }
  throw new Error(message)
}

export const safeJsonParse = (str: string | null | undefined): unknown => {
  if (str === null || str === undefined) {
    return null
  }
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
export const capitalize = (str: string) =>
  str[0] ? str[0].toUpperCase() + str.slice(1) : ""

export function deslugify(slug: string) {
  return slug
    .split("-")
    .map((part) => capitalize(part))
    .join(" ")
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatProductName(name: string, variant?: string) {
  return variant ? `${name} - ${variant}` : name
}

interface Money {
  amount: number
  currency: string
}

export const formatMoney = ({
  amount,
  currency,
  locale = "en-US",
}: Money & { locale?: string }) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount / 100)
}
