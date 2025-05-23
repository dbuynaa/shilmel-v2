import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { JSX } from "react";

export function WarehouseCardSkeleton(): JSX.Element {
	return (
		<Card className="h-full overflow-hidden">
			<AspectRatio ratio={21 / 9}>
				<div className="absolute inset-0 bg-linear-to-t from-transparent to-zinc-950/50" />
				<Skeleton className="absolute right-2 top-2 h-6 w-14 rounded-sm px-2 py-1" />
				<Skeleton className="size-full rounded-b-none" />
			</AspectRatio>
			<CardHeader className="space-y-2">
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-4 w-1/4" />
			</CardHeader>
		</Card>
	);
}
