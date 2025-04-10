import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ProfileSkeleton } from "@/components/store/profile/profile-skeleton";
import { UserProfile } from "@/components/store/profile/user-profile";

export default function ProfilePage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
			<div className="grid gap-6">
				<ErrorBoundary fallback={<div>Error loading profile. Please try again later.</div>}>
					<Suspense fallback={<ProfileSkeleton />}>
						<UserProfile />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	);
}
