"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This page is rendered on full reload
// We want to redirect to `/cart` to avoid conflict of the routes
export default function RedirectToCart() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/cart")
  }, [router])

  return null
}
