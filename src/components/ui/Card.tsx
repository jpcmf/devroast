import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

// Card Badge Variants
const badgeVariants = tv({
	base: "h-2 w-2 rounded-full flex-shrink-0",
	variants: {
		variant: {
			critical: "bg-red-500",
			warning: "bg-amber-500",
			info: "bg-blue-500",
			success: "bg-emerald-500",
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

// Card Wrapper
interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={`flex flex-col gap-3 rounded-lg border border-gray-700 bg-white p-5 ${className || ""}`}
		{...props}
	/>
));

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
	<div ref={ref} className={`flex items-center gap-2 ${className || ""}`} {...props} />
));

CardHeader.displayName = "Card.Header";

// Card Badge
interface CardBadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>(
	({ className, variant, ...props }, ref) => (
		<div ref={ref} className={badgeVariants({ variant, class: className })} {...props} />
	),
);

CardBadge.displayName = "Card.Badge";

// Card Label
interface CardLabelProps extends HTMLAttributes<HTMLSpanElement> {}

const CardLabel = forwardRef<HTMLSpanElement, CardLabelProps>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={`text-xs font-normal text-gray-700 font-jetbrains-mono ${className || ""}`}
		{...props}
	/>
));

CardLabel.displayName = "Card.Label";

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={`text-sm font-bold text-gray-900 font-jetbrains-mono ${className || ""}`}
		{...props}
	/>
));

CardTitle.displayName = "Card.Title";

// Card Description
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	({ className, ...props }, ref) => (
		<p
			ref={ref}
			className={`text-xs font-normal leading-relaxed text-gray-600 ${className || ""}`}
			{...props}
		/>
	),
);

CardDescription.displayName = "Card.Description";

// Compound component structure
interface CardComponent {
	(props: CardProps & React.RefAttributes<HTMLDivElement>): React.ReactElement;
	Header: typeof CardHeader;
	Badge: typeof CardBadge;
	Label: typeof CardLabel;
	Title: typeof CardTitle;
	Description: typeof CardDescription;
	displayName?: string;
}

const CardWithSubcomponents = Card as unknown as CardComponent;
CardWithSubcomponents.Header = CardHeader;
CardWithSubcomponents.Badge = CardBadge;
CardWithSubcomponents.Label = CardLabel;
CardWithSubcomponents.Title = CardTitle;
CardWithSubcomponents.Description = CardDescription;

const CardExport = CardWithSubcomponents;

export {
	CardExport as Card,
	CardHeader,
	CardBadge,
	CardLabel,
	CardTitle,
	CardDescription,
	badgeVariants,
	type CardProps,
	type CardHeaderProps,
	type CardBadgeProps,
	type CardLabelProps,
	type CardTitleProps,
	type CardDescriptionProps,
};
