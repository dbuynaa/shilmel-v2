import { auth } from "@/auth";
import { redirect } from "next/navigation";

import type { JSX } from "react";

export default async function AppDocumentsPage(): Promise<JSX.Element> {
	const session = await auth();
	if (!session) redirect("/signin");

	return <div className="p-5">TODO: App Documents Page</div>;
}
