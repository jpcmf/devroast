'use client'

import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface LeaderboardCodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	code: string;
	language?: string;
	theme?: string;
	maxHeight?: string;
}

export function LeaderboardCodeBlock({
	code,
	language = "javascript",
	theme = "vesper",
	maxHeight = "max-h-[120px]",
	className,
	...props
}: LeaderboardCodeBlockProps) {
	const [html, setHtml] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const highlightCode = async () => {
			try {
				const highlighted = await codeToHtml(code, {
					lang: language,
					theme,
				});
				if (isMounted) {
					setHtml(highlighted);
				}
			} catch (error) {
				// Fallback to plain text if language is not supported
				try {
					const plaintext = await codeToHtml(code, {
						lang: "plaintext",
						theme,
					});
					if (isMounted) {
						setHtml(plaintext);
					}
				} catch {
					// Final fallback: render plain text
					if (isMounted) {
						setHtml(`<pre>${code}</pre>`);
					}
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		highlightCode();

		return () => {
			isMounted = false;
		};
	}, [code, language, theme]);

	if (isLoading) {
		return (
			<div
				className={`${maxHeight} overflow-y-auto bg-gray-800 rounded border border-gray-700 px-3 py-2 text-xs font-jetbrains-mono ${className || ""}`}
				{...props}
			>
				<div className="text-gray-600 animate-pulse">loading...</div>
			</div>
		);
	}

	return (
		<div
			className={`${maxHeight} overflow-y-auto bg-gray-800 rounded border border-gray-700 px-0 py-0 text-xs font-jetbrains-mono ${className || ""}`}
			{...props}
		>
			<div
				className="text-gray-300"
				// biome-ignore lint: Shiki-generated HTML is safe
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}

export type { LeaderboardCodeBlockProps };
