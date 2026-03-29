"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components";

export function CodeEditorWrapper() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [roastMode, setRoastMode] = useState(false);

	const isCodeEmpty = code.trim().length === 0;

	const handleStartRoast = () => {
		// In production, this would send code to API and redirect with submission ID
		// For now, navigate to results page with first submission as demo
		router.push("/results/1");
	};

	return (
		<>
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
						onLanguageChange={(lang) => console.log("Language:", lang)}
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
					/>
					<span className="text-xs text-gray-500 font-jetbrains-mono">{`// maximum sarcasm enabled`}</span>
				</div>
				<Button variant="primary" size="md" disabled={isCodeEmpty} onClick={handleStartRoast}>
					{`$ start the roast`}
				</Button>
			</div>
		</>
	);
}
