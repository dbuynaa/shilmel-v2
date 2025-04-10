export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	variant?: {
		sku: string;
		image?: string;
		size?: string;
	};
}

export interface Cart {
	items: CartItem[];
	total: number;
}
