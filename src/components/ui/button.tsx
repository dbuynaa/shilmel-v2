import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"focus-visible:outline-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"from-primary/85 to-primary text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-zinc-950/35 shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-zinc-950/50",
				destructive: "shadow-2xs bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"bg-muted hover:bg-background dark:bg-muted/25 dark:hover:bg-muted/50 dark:border-border inset-shadow-2xs inset-shadow-white dark:inset-shadow-transparent relative flex border border-zinc-300 shadow-sm shadow-zinc-950/10 ring-0 duration-150",
				secondary: "shadow-2xs bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				navbarIcon:
					"m-0 p-1 transition-all duration-300 ease-in-out hover:bg-accent hover:text-accent-foreground",
				user: "flex items-center justify-center",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
