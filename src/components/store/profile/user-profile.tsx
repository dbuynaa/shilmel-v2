import { getUserProfile } from "@/actions/store/profile-actions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProfileForm } from "./profile-form";

export async function UserProfile() {
	const user = await getUserProfile();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-6 flex items-center space-x-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={user.image ?? ""} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-2xl font-bold">{user.name}</h2>
						<p className="text-muted-foreground">{user.email}</p>
					</div>
				</div>
				<ProfileForm
					user={{
						name: user.name,
						email: user.email,
						image: user.image ?? "",
					}}
				/>
			</CardContent>
		</Card>
	);
}
