import type { JSX } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { InstantHelperMenu } from "@/components/admin/nav/app/menus/instant-helper-menu"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

interface SubheaderProps {
  buttonText: string
  buttonLink: string
}

export function Subheader({
  buttonText,
  buttonLink,
}: SubheaderProps): JSX.Element {
  return (
    <div className="flex h-20 w-full items-center justify-end border-b bg-tertiary px-5">
      <div className="flex items-center gap-2">
        <CustomTooltip text="Add New Category">
          <Link
            href={buttonLink}
            className={cn(buttonVariants(), "gap-1")}
            aria-label="Add new item"
          >
            <Icons.plus aria-hidden="true" className="size-4" />
            <span>{buttonText}</span>
          </Link>
        </CustomTooltip>
        <InstantHelperMenu />
      </div>
    </div>
  )
}
