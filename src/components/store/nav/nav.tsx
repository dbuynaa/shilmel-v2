import { auth } from "@/auth";
import { UserIcon } from "lucide-react";

import { getAllCategories } from "@/actions/product/categories";
import { CartSummaryNav } from "@/components/store/nav/cart-summary-nav";
import { NavMenu } from "@/components/store/nav/nav-menu";
import { SearchNav } from "@/components/store/nav/search-nav";
import { SeoH1 } from "@/components/store/seo-h1";
import { YnsLink } from "@/components/store/yns-link";
import { UserMenu } from "@/components/user-menu";
import config from "@/config/store.config";

export const Nav = async () => {
	const user = await auth();
	const categories = await getAllCategories();

	return (
		<header className="nav-border-reveal bg-background/90 sticky top-0 z-50 py-4 backdrop-blur-xs">
			<div className="mx-auto flex max-w-7xl flex-row items-center gap-2 px-4 sm:px-6 lg:px-8">
				<YnsLink href="/">
					<SeoH1 className="-mt-0.5 text-xl font-bold whitespace-nowrap">{config.storeName}</SeoH1>
				</YnsLink>

				<div className="flex w-auto max-w-full shrink overflow-auto max-sm:order-2 sm:mr-auto">
					<NavMenu categories={categories} />
				</div>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<CartSummaryNav />
				{/* <UserMenu /> */}
				{user ? (
					<UserMenu session={user} />
				) : (
					<YnsLink href="/signin">
						<UserIcon className="hover:text-neutral-500" />
					</YnsLink>
				)}
			</div>
		</header>
	);
};
