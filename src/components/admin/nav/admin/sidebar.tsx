"use client"

import * as React from "react"
import type { JSX } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/components/admin/nav/admin/sidebar-nav"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

export function Sidebar(): JSX.Element {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)

  return (
    <aside
      className={cn(
        "bg-tertiary flex h-screen flex-col justify-between border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-fit" : "w-66 shrink-0"
      )}
    >
      <div>
        <div className="flex h-20 items-center">
          <Link
            href="/admin/home/dashboard"
            className="flex w-full items-center justify-center gap-2"
          >
            <Icons.logo className="size-5" />
            <span
              className={cn(
                "leading-none font-bold tracking-wide whitespace-nowrap",
                collapsed && "hidden"
              )}
            >
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div>
        <div className="flex h-16 items-center justify-center border-t px-2">
          <CustomTooltip text={collapsed ? "Expand Navbar" : "Collapse Navbar"}>
            <Button
              variant="secondary"
              aria-label="Expand or collapse sidebar"
              className="w-full transition-all duration-300 ease-in-out"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <Icons.chevronRight className="size-4" aria-hidden="true" />
              ) : (
                <Icons.chevronLeft className="size-4" aria-hidden="true" />
              )}
            </Button>
          </CustomTooltip>
        </div>
      </div>
    </aside>
  )
}
