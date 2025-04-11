import "@/styles/globals.css";

import { auth } from "@/auth";
import { env } from "@/env.mjs";
import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages } from "@/i18n/server";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import type * as React from "react";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { fontInter } from "@/config/fonts";
import config from "@/config/store.config";

import { ThemeProvider } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: {
		default: config.storeName,
		template: `%s - ${config.storeName}`,
	},
	description: config.description,
	authors: [
		{
			name: config.author,
			url: config.links.authorsWebsite,
		},
	],
	creator: config.author,
	keywords: config.keywords,
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: config.url,
		title: config.storeName,
		description: config.description,
		siteName: config.storeName,
	},
	twitter: {
		card: "summary_large_image",
		title: config.storeName,
		description: config.description,
		images: [config.links.openGraphImage],
		creator: config.author,
	},
	icons: {
		icon: "/favicon.ico",
	},
	// manifest: `${siteConfig.url}/site.webmanifest`,
};

interface RootLayoutProps {
	children: React.ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
	const session = await auth();
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn("font-sans antialiased", fontInter.className)}>
				<SessionProvider session={session}>
					<IntlClientProvider messages={messages} locale={locale}>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
							{children}

							<Toaster />
							<TailwindIndicator />
						</ThemeProvider>
					</IntlClientProvider>
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
