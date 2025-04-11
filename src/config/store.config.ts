import AccessoriesImage from "@/images/accessories.jpg";
import ApparelImage from "@/images/apparel.jpg";

const links = {
	github:
		"https://github.com/pjborowiecki/QUANTUM-STASH-inventory-Management-SaaS-NextJs-TypeScript-Postgres-Drizzle-Tailwind.git",
	twitter: "https://twitter.com/pjborowiecki",
	linkedin: "https://www.linkedin.com/in/pjborowiecki",
	discord: "",
	authorsWebsite: "https://pjborowiecki.com",
	authorsGitHub: "https://github.com/pjborowiecki",
	openGraphImage: "https://quantumstash.com/images/opengraph-image.png",
};

export const config = {
	storeName: "Shilmel Store",
	description:
		"Quantum Stash is an open-source Software as a Service (SaaS) web application designed for efficient inventory management. Built with Next.js, Next-Auth, Postgres, Drizzle, Tailwind, ShadCN UI and many other fantastic tools.",
	links,
	url: "https://quantumstash.com",
	ogImage: links.openGraphImage,
	author: "pjborowiecki",
	hostingRegion: "fra1",
	keywords: ["SaaS", "Next.js", "Full-stack"],
	storeDescription: "Your Store Description",
	categories: [
		{ name: "Apparel", slug: "apparel", image: ApparelImage },
		{ name: "Accessories", slug: "accessories", image: AccessoriesImage },
	],

	social: {
		x: "https://x.com/yourstore",
		facebook: "https://facebook.com/yourstore",
	},

	contact: {
		email: "support@yourstore.com",
		phone: "+1 (555) 111-4567",
		address: "123 Store Street, City, Country",
	},
};

export type StoreConfig = typeof config;
export default config;
