import { env } from "@/env";
import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";
import type { JSX } from "react";

import config from "@/config/store.config";

interface EmailVerificationEmailProps {
	email: string;
	emailVerificationToken: string;
}

export function EmailVerificationEmail({
	email,
	emailVerificationToken,
}: Readonly<EmailVerificationEmailProps>): JSX.Element {
	const previewText = `${config.storeName} email verification.`;
	return (
		<Html lang="en">
			<Head>
				<title>{previewText}</title>
			</Head>
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body>
					<Container>
						<Section>
							<Text className="text-xl">Hi,</Text>
							<Text className="text-base">
								Your email address, {email}, was recently used to sign up at{" "}
								<span className="font-semibold tracking-wide">{config.storeName}</span>.
							</Text>
							<Text className="text-base">Please verify this address by clicking the button below</Text>
							<Button href={`${env.NEXT_PUBLIC_APP_URL}/signup/verify-email?token=${emailVerificationToken}`}>
								Verify email now
							</Button>
						</Section>

						<Section>
							<Text className="text-xs">
								If you didn&apos;t sign up at {config.storeName}, just ignore and delete this message.
							</Text>
							<Text className="text-base font-medium">
								Enjoy <span className="font-semibold tracking-wide">{config.storeName}</span> and have a nice
								day!
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
