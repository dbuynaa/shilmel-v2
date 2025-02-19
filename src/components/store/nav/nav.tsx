import { UserIcon } from "lucide-react"

import { CartSummaryNav } from "@/components/store/nav/cart-summary-nav"
import { NavMenu } from "@/components/store/nav/nav-menu"
import { SearchNav } from "@/components/store/nav/search-nav"
import { SeoH1 } from "@/components/store/seo-h1"
import { YnsLink } from "@/components/store/yns-link"

export const Nav = async () => {
  return (
    <header className="backdrop-blur-xs nav-border-reveal sticky top-0 z-50 bg-background/90 py-4">
      <div className="mx-auto flex max-w-7xl flex-row items-center gap-2 px-4 sm:px-6 lg:px-8">
        <YnsLink href="/">
          <SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">
            Your Next Store
          </SeoH1>
        </YnsLink>

        <div className="flex w-auto max-w-full shrink overflow-auto max-sm:order-2 sm:mr-auto">
          <NavMenu />
        </div>
        <div className="ml-auto mr-3 sm:ml-0">
          <SearchNav />
        </div>
        <CartSummaryNav />
        <YnsLink href="/login">
          <UserIcon className="hover:text-neutral-500" />
        </YnsLink>
      </div>
    </header>
  )
}
