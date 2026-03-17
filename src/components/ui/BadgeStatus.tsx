"use client";

import { HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeStatusVariants = tv({
	base: "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-normal font-jetbrains-mono",
	variants: {
		variant: {
			critical: "text-red-600 bg-red-50",
			warning: "text-amber-600 bg-amber-50",
			good: "text-emerald-600 bg-emerald-50",
			needs_serious_help: "text-red-600 bg-red-50",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

const badgeDotVariants = tv({
	base: "h-2 w-2 rounded-full flex-shrink-0",
	variants: {
		variant: {
			critical: "bg-red-500",
			warning: "bg-amber-500",
			good: "bg-emerald-500",
			needs_serious_help: "bg-red-500",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

interface BadgeStatusProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeStatusVariants> {
	children?: React.ReactNode;
}

const BadgeStatus = forwardRef<HTMLDivElement, BadgeStatusProps>(
	({ className, variant = "good", children, ...props }, ref) => {
		return (
			<div ref={ref} className={badgeStatusVariants({ variant, class: className })} {...props}>
				<div className={badgeDotVariants({ variant })} />
				<span>{children}</span>
			</div>
		);
	},
);

BadgeStatus.displayName = "BadgeStatus";

export { BadgeStatus, badgeStatusVariants, badgeDotVariants, type BadgeStatusProps };
