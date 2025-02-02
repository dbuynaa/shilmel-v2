"use client"

import { useState } from "react"
import { useTranslations } from "@/i18n/client"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signForNewsletter } from "@/components/store/footer/actions"

export const Newsletter = () => {
  const t = useTranslations("Global.newsletter")
  const [loading, setLoading] = useState(false)
  return (
    <form
      className="flex gap-x-2"
      onSubmit={() => {
        setLoading(true)
      }}
      action={async (formData) => {
        try {
          const result = await signForNewsletter(formData)
          if (result?.status && result.status < 400) {
            toast.info(t("success"), {
              position: "bottom-left",
            })
          } else {
            toast.error(t("error"), { position: "bottom-left" })
          }
        } catch (error) {
          toast.error(t("error"), { position: "bottom-left" })
        } finally {
          setLoading(false)
        }
      }}
    >
      <Input
        className="max-w-lg flex-1"
        placeholder={t("emailPlaceholder")}
        type="email"
        name="email"
        required
      />
      <Button
        type="submit"
        className="w-24 rounded-full"
        variant="default"
        disabled={loading}
      >
        {loading ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          t("subscribeButton")
        )}
      </Button>
    </form>
  )
}
