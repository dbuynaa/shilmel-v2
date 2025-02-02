import type { JSX } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { InstantHelperMenu } from "@/components/admin/nav/app/menus/instant-helper-menu"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

export function BrandsSubheader(): JSX.Element {
  return (
    <div className="flex h-20 w-full items-center justify-end border-b bg-tertiary px-5">
      <div className="flex items-center gap-2">
        <CustomTooltip text="Add New Brand">
          <Link
            href="/app/inventory/brands/new-brand"
            className={cn(buttonVariants(), "gap-1")}
            aria-label="Add new brand"
          >
            <Icons.plus aria-hidden="true" className="size-4" />
            <span>New Brand</span>
          </Link>
        </CustomTooltip>
        <InstantHelperMenu />
      </div>
    </div>
  )
}
