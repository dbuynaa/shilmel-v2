import type { JSX } from "react"
import Link from "next/link"
import { auth } from "@/auth"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AppsMenu } from "@/components/admin/nav/admin/menus/apps-menu"
import { NotificationsMenu } from "@/components/admin/nav/admin/menus/notifications-menu"
import { OrganizationMenu } from "@/components/admin/nav/admin/menus/organization-menu"
import { QuickCreateMenu } from "@/components/admin/nav/admin/menus/quick-create-menu"
import { ReferAndEarnMenu } from "@/components/admin/nav/admin/menus/refer-and-earn-menu"
import { UserMenu } from "@/components/admin/nav/admin/menus/user-menu"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { Search } from "@/components/search"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="bg-tertiary sticky top-0 z-50 flex h-20 items-center justify-between gap-8 border-b px-5">
      <div className="flex h-full items-center gap-2">
        <CustomTooltip text="Recent Activity">
          <Link
            aria-label="Recent Activity"
            href="/admin/home/updates"
            className={cn(buttonVariants({ variant: "outline" }), "p-3")}
          >
            <Icons.recentActivities aria-hidden="true" className="size-4" />
          </Link>
        </CustomTooltip>

        <Search />
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center">
          <QuickCreateMenu />
          <ReferAndEarnMenu />
          <NotificationsMenu />

          <CustomTooltip text="Settings">
            <Link
              href="/admin/settings"
              aria-label="Settings"
              className={cn(buttonVariants({ variant: "ghost" }), "p-3")}
            >
              <Icons.settings aria-hidden="true" className="size-4" />
            </Link>
          </CustomTooltip>
        </div>

        <OrganizationMenu />
        <UserMenu session={session!} />

        <div className="flex items-center justify-center">
          <AppsMenu />
        </div>
      </div>
    </header>
  )
}
