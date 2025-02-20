import type { JSX } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ItemGroupsDropdown } from "@/components/admin/inventory/dropdowns/item-groups-dropdown"
import { ItemGroupsSelect } from "@/components/admin/inventory/selects/item-groups-select"
import { ViewToggle } from "@/components/admin/inventory/view-toggle"
import { InstantHelperMenu } from "@/components/admin/nav/admin/menus/instant-helper-menu"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

export function ItemGroupsSubheader(): JSX.Element {
  return (
    <div className="bg-tertiary flex h-20 w-full items-center justify-between border-b px-5">
      <ItemGroupsSelect />

      <div className="flex items-center gap-2">
        <CustomTooltip text="Add New Item Group">
          <Link
            href="/admin/inventory/items/new-item-group"
            className={cn(buttonVariants(), "gap-1")}
            aria-label="Add new item group"
          >
            <Icons.plus aria-hidden="true" className="size-4" />
            <span>New</span>
          </Link>
        </CustomTooltip>

        <ViewToggle />
        <ItemGroupsDropdown />
        <InstantHelperMenu />
      </div>
    </div>
  )
}
