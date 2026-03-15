"use client";

import { InputHTMLAttributes, ChangeEvent, forwardRef, useId, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggleVariants = tv({
	base: "relative inline-flex items-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		checked: {
			true: "bg-emerald-500 focus-visible:ring-emerald-500",
			false: "bg-gray-300 focus-visible:ring-gray-600",
		},
		size: {
			sm: "w-8 h-5 rounded-full",
			md: "w-10 h-6 rounded-full",
			lg: "w-12 h-7 rounded-full",
		},
	},
	defaultVariants: {
		checked: false,
		size: "md",
	},
});

const knobVariants = tv({
	base: "absolute rounded-full transition-all",
	variants: {
		checked: {
			true: "translate-x-5 bg-black",
			false: "translate-x-1 bg-gray-600",
		},
		size: {
			sm: "w-4 h-4",
			md: "w-4 h-4",
			lg: "w-5 h-5",
		},
	},
	defaultVariants: {
		checked: false,
		size: "md",
	},
});

interface ToggleProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">,
		VariantProps<typeof toggleVariants> {
	label?: string;
	labelId?: string;
	defaultChecked?: boolean;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	(
		{ className, checked, size, label, labelId, disabled, defaultChecked, onChange, ...props },
		ref,
	) => {
		const generatedId = useId();
		const inputId = labelId || generatedId;
		const isControlled = checked !== undefined;

		const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

		const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
			if (!isControlled) {
				setInternalChecked(e.target.checked);
			}
			onChange?.(e);
		};

		const currentChecked = isControlled ? checked : internalChecked;

		return (
			<div className="flex items-center gap-3">
				<div
					className={toggleVariants({
						checked: currentChecked as boolean,
						size,
						class: className,
					})}
				>
					<input
						ref={ref}
						id={inputId}
						type="checkbox"
						{...(isControlled ? { checked } : { defaultChecked })}
						onChange={handleChange}
						disabled={disabled}
						className="sr-only"
						{...props}
					/>
					<div
						className={knobVariants({
							checked: currentChecked as boolean,
							size,
						})}
					/>
				</div>
				{label && (
					<label
						htmlFor={inputId}
						className="text-sm font-normal font-jetbrains-mono"
						style={{
							color: currentChecked ? "#10b981" : "#9ca3af",
						}}
					>
						{label}
					</label>
				)}
			</div>
		);
	},
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants, knobVariants, type ToggleProps };
