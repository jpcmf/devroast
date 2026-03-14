"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-emerald-500 text-black hover:bg-emerald-600 focus-visible:ring-emerald-500",
			secondary:
				"bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-600",
			link: "bg-transparent text-gray-600 hover:text-gray-900 focus-visible:ring-gray-600",
			danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
			ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-600",
		},
		size: {
			sm: "px-3 py-1.5 text-sm",
			md: "px-6 py-2.5 text-sm",
			lg: "px-6 py-3 text-lg",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
	compoundVariants: [],
});

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={buttonVariants({ variant, size, class: className })}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
