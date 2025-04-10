import { auth } from "@/auth";
import { redirect } from "next/navigation";

import type { JSX } from "react";

export default async function AppPurchasesVendorsNewVendorPage(): Promise<JSX.Element> {
	const session = await auth();
	if (!session) redirect("/signin");

	return <div>App Purchases Vendors NewVendor Page</div>;
}
