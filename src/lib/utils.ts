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

export function invariant(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
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

export const deslugify = (slug: string) => {
  return slug
    .split("-")
    .map((part) => capitalize(part))
    .join(" ")
}

export const formatProductName = (name: string, variant?: string) => {
  if (!variant) {
    return name
  }
  return `${name} (${deslugify(variant)})`
}

type Money = { amount: number; currency: string }

const getDecimalsForStripe = (currency: string) => {
  invariant(currency.length === 3, "currency needs to be a 3-letter code")

  const stripeDecimals = stripeCurrencies[currency.toUpperCase()]
  const decimals = stripeDecimals ?? 2
  return decimals
}

export const getDecimalFromStripeAmount = ({
  amount: minor,
  currency,
}: Money) => {
  assertInteger(minor)
  const decimals = getDecimalsForStripe(currency)
  const multiplier = 10 ** decimals
  return Number.parseFloat((minor / multiplier).toFixed(decimals))
}

export const formatMoney = ({
  amount: minor,
  currency,
  locale = "en-US",
}: Money & { locale?: string }) => {
  const amount = getDecimalFromStripeAmount({ amount: minor, currency })
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

export const assertInteger = (value: number) => {
  invariant(Number.isInteger(value), "Value must be an integer")
}

const stripeCurrencies: Record<string, number> = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  MGA: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,

  BHD: 3,
  JOD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
}
