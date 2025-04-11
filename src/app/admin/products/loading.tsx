export default function Loading() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center justify-center space-y-2">
				<div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-12 w-12"></div>
				<p className="text-lg font-semibold text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
