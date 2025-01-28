"use client"

import type { JSX } from "react"
import { useSession } from "next-auth/react"
import { auth } from "@/auth"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SignOutButton } from "@/components/auth/signout-button"
import { Icons } from "@/components/icons"

export function UserMenu(): JSX.Element {
  const { data: session } = useSession()

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "user", size: "icon" }),
          "transition-all duration-300 ease-in-out hover:opacity-70"
        )}
      >
        <Avatar className="size-9 rounded-md">
          {session?.user.image ? (
            <AvatarImage src={session.user.image} className="size-9" />
          ) : (
            <AvatarFallback className="size-9 rounded-md">
              <Icons.user className="size-4" />
            </AvatarFallback>
          )}
        </Avatar>
      </SheetTrigger>
      <SheetContent className="z-[99]">
        <SheetHeader>
          <SheetTitle>TODO: User Menu</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <SignOutButton />
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
