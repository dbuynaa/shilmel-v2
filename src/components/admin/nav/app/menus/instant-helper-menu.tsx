import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

import type { JSX } from "react";

export function InstantHelperMenu(): JSX.Element {
  return (
    <Sheet>
      <SheetTrigger className="flex size-9 items-center justify-center rounded-md bg-orange-600 hover:bg-orange-600/80">
        <CustomTooltip text="Instant Helper">
          <Icons.helpBadge className="size-5 text-foreground" />
        </CustomTooltip>
      </SheetTrigger>
      <SheetContent className="z-[99]">
        <SheetHeader>
          <SheetTitle>TODO: Instant Helper Menu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
