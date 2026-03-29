"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Toggle, CodeEditor } from "@/components";

export default function Home() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [roastMode, setRoastMode] = useState(false);

	const isCodeEmpty = code.trim().length === 0;

	const handleStartRoast = () => {
		// In production, this would send code to API and redirect with submission ID
		// For now, navigate to results page with mock data
		router.push("/results");
	};

	return (
		<div className="min-h-screen">
			{/* Main Content */}
			<main className="flex flex-col items-center gap-8 px-10 py-20">
				{/* Hero Section */}
				<div className="max-w-2xl space-y-3 text-center">
					<h1 className="text-4xl font-bold text-gray-100 font-jetbrains-mono">
						<span className="text-emerald-500">{`$ `}</span>paste your code. get roasted.
					</h1>
					<p className="text-sm text-gray-400 font-jetbrains-mono">
						{`// drop your code below and we'll rate it — brutally honest or full roast mode`}
					</p>
				</div>

				{/* Code Input Section */}
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
						<Button
							variant="primary"
							size="md"
							disabled={isCodeEmpty}
							onClick={handleStartRoast}
						>
							{`$ start the roast`}
						</Button>
					</div>

					{/* Footer Stats */}
					<div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-jetbrains-mono">
						<span>2,847 codes roasted</span>
						<span>·</span>
						<span>avg score: 4.2/10</span>
					</div>
				</div>

				{/* Spacer */}
				<div className="h-12" />

				{/* Leaderboard Preview Section */}
				<div className="w-full max-w-3xl space-y-4" id="leaderboard">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
								{`// `}
								<span className="text-emerald-500">shame leaderboard</span>
							</h2>
							<p className="text-xs text-gray-500 font-jetbrains-mono mt-2">
								{`// the worst code on the internet, ranked by shame`}
							</p>
						</div>
						<a
							href="/leaderboard"
							className="text-xs text-emerald-500 font-jetbrains-mono hover:text-emerald-400 transition-colors"
						>
							$ view_all &gt;&gt;
						</a>
					</div>

					{/* Leaderboard Table Preview */}
					<div className="border border-gray-700 bg-gray-900 overflow-hidden">
						{/* Table Header - Pixel Perfect: height 40, padding 0 vertical + 20 horizontal, centered items */}
						<div className="flex items-center border-b border-gray-700 bg-gray-800 px-5 text-xs font-bold text-gray-400 font-jetbrains-mono h-10">
							<div className="w-12">#</div>
							<div className="w-[70px]">score</div>
							<div className="flex-1">code</div>
							<div className="w-[100px]">lang</div>
						</div>

						{/* Table Rows - Pixel Perfect: padding 16 vertical + 20 horizontal */}
						<div>
							{[
								{ rank: 1, score: "1.2", code: 'eval(prompt("enter code"))', lang: "javascript" },
								{
									rank: 2,
									score: "1.8",
									code: "if (x == true) { return true; }",
									lang: "typescript",
								},
								{ rank: 3, score: "2.1", code: "SELECT * FROM users WHERE 1=1", lang: "sql" },
							].map((item) => (
								<div
									key={item.rank}
									className="flex items-center border-b border-gray-700 px-5 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors h-12"
								>
									<div className="w-12 font-bold text-gray-500">{item.rank}</div>
									<div className="w-[70px] font-bold text-red-400">{item.score}</div>
									<div className="flex-1 text-gray-300">{item.code}</div>
									<div className="w-[100px] text-gray-500">{item.lang}</div>
								</div>
							))}
						</div>
					</div>

					{/* View More Hint */}
					<div className="flex items-center justify-center py-4 text-xs text-gray-600 font-jetbrains-mono">
						showing top 3 of 2,847 ·{" "}
						<a href="/leaderboard" className="text-emerald-500 hover:text-emerald-400 ml-1">
							view full leaderboard &gt;&gt;
						</a>
					</div>
				</div>

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	);
}
