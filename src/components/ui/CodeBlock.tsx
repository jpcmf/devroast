import { HTMLAttributes } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	code: string;
	language?: string;
	filename?: string;
	theme?: string;
}

async function CodeBlock({
	code,
	language = "javascript",
	filename = "code.js",
	theme = "vesper",
	className,
	...props
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme,
	});

	const lines = code.split("\n").filter((line) => line.trim().length > 0);
	const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);

	return (
		<div
			className={`flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-950 ${className || ""}`}
			{...props}
		>
			{/* Header */}
			<div className="flex items-center gap-3 border-b border-gray-700 bg-gray-900 px-4 py-3">
				{/* Window Controls */}
				<div className="flex gap-2">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-amber-500" />
					<div className="h-3 w-3 rounded-full bg-emerald-500" />
				</div>

				{/* Spacer */}
				<div className="flex-1" />

				{/* Filename */}
				<span className="text-xs font-normal text-gray-500 font-jetbrains-mono">{filename}</span>
			</div>

			{/* Code Body */}
			<div className="flex overflow-hidden bg-gray-950">
				{/* Line Numbers */}
				<div className="flex flex-col border-r border-gray-700 bg-gray-950 px-3 py-3 text-right text-xs font-normal text-gray-600 font-jetbrains-mono">
					{lineNumbers.map((lineNum) => (
						<div key={lineNum} className="h-6 leading-6">
							{lineNum}
						</div>
					))}
				</div>

				{/* Code Content */}
				<div
					className="flex-1 overflow-auto py-3 px-4 text-sm font-jetbrains-mono"
					// biome-ignore lint: Shiki-generated HTML is safe
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}

export { CodeBlock, type CodeBlockProps };
