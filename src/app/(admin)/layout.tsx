import type * as React from "react";
import type { JSX } from "react";

import { Header } from "@/components/admin/nav/admin/header";
import { Sidebar } from "@/components/admin/nav/admin/sidebar";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps): Promise<JSX.Element> {
	return (
		<div className="flex">
			<Sidebar />
			<div className="h-screen w-full overflow-y-auto">
				<Header />
				<main>{children}</main>
			</div>
		</div>
	);
}
