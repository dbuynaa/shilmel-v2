import Image from "next/image"
import Link from "next/link"
import { Session } from "next-auth"
import { getTranslations } from "@/i18n/server"
import {
  Bolt,
  BookOpen,
  Layers2,
  NotebookTabs,
  UserIcon,
  UserPen,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/auth/signout-button"

export async function UserMenu({ session }: { session: Session }) {
  const user = session.user
  const t = await getTranslations("Global.userMenu")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserIcon className="cursor-pointer hover:text-neutral-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex items-start gap-3">
          {user?.image ? (
            <Image
              src={user.image ?? ""}
              alt="Avatar"
              width={32}
              height={32}
              sizes="32px"
              className="shrink-0 rounded-full"
            />
          ) : (
            <h1 className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              {user?.name?.slice(0, 1)}
            </h1>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user?.name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === "ADMIN" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Bolt
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Admin</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <Layers2
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Landing</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* <DropdownMenuItem>
            <BookOpen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Option 3</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <NotebookTabs
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("orders")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>{t("account")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton title={t("logout")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
