"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Toggle, CodeEditor } from "@/components";

export function CodeEditorSection() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("javascript");
	const [roastMode, setRoastMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const isCodeEmpty = code.trim().length === 0;

	const handleStartRoast = async () => {
		if (isCodeEmpty) {
			toast.error("Please paste some code first");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/trpc/submissions.create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code,
					language: language as "javascript" | "typescript" | "python" | "rust" | "golang" | "java" | "csharp" | "php" | "ruby" | "kotlin" | "sql" | "html" | "css" | "json" | "yaml" | "bash" | "other",
					roastMode,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error?.message || "Failed to submit code");
			}

			const data = await response.json();

			if (!data.result?.data?.submissionId) {
				throw new Error("Invalid response from server");
			}

			toast.success("Code submitted! Preparing your roast...");
			// Redirect to results page
			router.push(`/results/${data.result.data.submissionId}`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to submit code. Please try again.";
			toast.error(errorMessage);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-3xl space-y-4">
			{/* Code Editor */}
			<div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
				{/* Window Header */}
				<div className="flex items-center gap-3 border-b border-gray-700 bg-gray-800 px-4 py-2.5">
					<div className="flex gap-2">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					</div>
					<span className="ml-auto text-xs text-gray-500 font-jetbrains-mono">
						paste your code here
					</span>
				</div>

				{/* Code Area */}
				<div className="p-4">
					<CodeEditor
						value={code}
						onChange={setCode}
						language={language}
						onLanguageChange={setLanguage}
					/>
				</div>
			</div>

			{/* Actions Bar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle
						checked={roastMode}
						onChange={(e) => setRoastMode(e.target.checked)}
						label="roast mode"
						disabled={isLoading}
					/>
					<span className="text-xs text-gray-500 font-jetbrains-mono">{`// maximum sarcasm enabled`}</span>
				</div>
				<Button
					variant="primary"
					size="md"
					disabled={isCodeEmpty || isLoading}
					onClick={handleStartRoast}
				>
					{isLoading ? "$ submitting..." : `$ start the roast`}
				</Button>
			</div>
		</div>
	);
}
