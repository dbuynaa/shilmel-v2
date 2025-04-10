import { CartModalProvider } from "@/context/cart-modal";

import { Footer } from "@/components/store/footer/footer";
import { Nav } from "@/components/store/nav/nav";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartModalPage } from "./cart/cart-modal";

export default async function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CartModalProvider>
			<Nav />
			<TooltipProvider>
				<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-2 sm:px-6 lg:px-8">
					{children}
					<CartModalPage />
				</main>
				<Footer />
			</TooltipProvider>
		</CartModalProvider>
	);
}
