import { auth } from "@/auth";
import { redirect } from "next/navigation";

import type { JSX } from "react";

export default async function AppSalesPackagesPage(): Promise<JSX.Element> {
	const session = await auth();
	if (!session) redirect("/signin");

	return <div>App Sales Packages Page</div>;
}
