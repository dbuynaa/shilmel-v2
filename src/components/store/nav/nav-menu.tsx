import Link from "next/link"
import { getAllCategories } from "@/actions/inventory/categories"
import { getStoreConfig } from "@/store.config"

// import StoreConfig from "@/store.config"

import { NavMobileMenu } from "@/components/store/nav/nav-mobile-menu.client"

const { categories } = await getStoreConfig()

const links = [
  {
    label: "Home",
    href: "/",
  },
  // ...(categories?.map(({ name }) => ({
  //   label: name,
  //   href: `/category/${name}`,
  // })) || []),
  ...categories.map(({ name, slug }) => ({
    label: name,
    href: `/category/${slug}`,
  })),
]

export const NavMenu = () => {
  return (
    <>
      <div className="hidden sm:block">
        <ul className="flex flex-row items-center justify-center gap-x-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="focus:outline-hidden group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center sm:hidden">
        <NavMobileMenu>
          <ul className="flex flex-col items-stretch justify-center gap-x-1 pb-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus:outline-hidden group inline-flex h-9 w-full items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </NavMobileMenu>
      </div>
    </>
  )
}
