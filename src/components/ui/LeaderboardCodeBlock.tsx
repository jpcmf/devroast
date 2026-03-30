import type { HTMLAttributes } from "react";
import { codeToHtml } from "shiki";

interface LeaderboardCodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	code: string;
	language?: string;
	theme?: string;
	maxHeight?: string;
}

async function LeaderboardCodeBlock({
	code,
	language = "javascript",
	theme = "vesper",
	maxHeight = "max-h-[120px]",
	className,
	...props
}: LeaderboardCodeBlockProps) {
	let html: string;

	try {
		html = await codeToHtml(code, {
			lang: language,
			theme,
		});
	} catch (error) {
		// Fallback to plain text if language is not supported
		html = await codeToHtml(code, {
			lang: "plaintext",
			theme,
		});
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

export { LeaderboardCodeBlock, type LeaderboardCodeBlockProps };
