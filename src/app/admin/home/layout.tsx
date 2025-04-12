import type { JSX, ReactNode } from "react";

interface AppHomeLayoutProps {
	children: ReactNode;
}

export default function AppHomeLayout({ children }: AppHomeLayoutProps): JSX.Element {
	return (
		<div>
			{/* <Subheader /> */}
			<div>{children}</div>
		</div>
	);
}
