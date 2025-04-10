import { auth } from "@/auth";
import { redirect } from "next/navigation";

import type { JSX } from "react";

export default async function AppSalesPaymentsReceivedPage(): Promise<JSX.Element> {
	const session = await auth();
	if (!session) redirect("/signin");

	return <div>App Sales PaymentsReceived Page</div>;
}
