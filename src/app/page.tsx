'use client'

import { useState } from "react";
import { Button, Toggle } from "@/components";

export default function Home() {
	const [code, setCode] = useState("");
	const [roastMode, setRoastMode] = useState(false);

	const isCodeEmpty = code.trim().length === 0;

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
							<span className="ml-auto text-xs text-gray-500 font-jetbrains-mono">paste your code here</span>
						</div>

						{/* Code Area */}
						<div className="min-h-80 p-6 font-jetbrains-mono text-sm text-gray-300">
							<textarea
								placeholder="function myAwesomeCode() {
  // your code here
  return 'roast me!';
}"
								className="h-64 w-full resize-none bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none"
								value={code}
								onChange={(e) => setCode(e.target.value)}
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
							<span className="text-xs text-gray-500 font-jetbrains-mono">standard mode</span>
						</div>
						<Button variant="primary" size="md" disabled={isCodeEmpty}>
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
						<a href="/" className="text-xs text-emerald-500 font-jetbrains-mono hover:text-emerald-400 transition-colors">
							see all →
						</a>
					</div>

					{/* Leaderboard Table Preview */}
					<div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
						{/* Table Header */}
						<div className="flex items-center gap-4 border-b border-gray-700 bg-gray-800 px-6 py-3 text-xs font-bold text-gray-400 font-jetbrains-mono">
							<div className="w-12">#</div>
							<div className="flex-1">code</div>
							<div className="w-20">score</div>
							<div className="w-20">roasts</div>
						</div>

						{/* Table Rows */}
						<div className="space-y-0">
							{[
								{ rank: 1, code: "eval(user_input)", score: "1/10", roasts: "2,341" },
								{ rank: 2, code: "var x = y = z = 1", score: "1.5/10", roasts: "1,892" },
								{ rank: 3, code: "if (x == true) {...}", score: "2/10", roasts: "1,654" },
							].map((item) => (
								<div
									key={item.rank}
									className="flex items-center gap-4 border-b border-gray-700 px-6 py-3 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors"
								>
									<div className="w-12 font-bold text-gray-500">{item.rank}</div>
									<div className="flex-1 text-gray-300">{item.code}</div>
									<div className="w-20 text-red-400">{item.score}</div>
									<div className="w-20 text-gray-500">{item.roasts}</div>
								</div>
							))}
						</div>
					</div>

					{/* View More Hint */}
					<div className="flex items-center justify-center py-4 text-xs text-gray-600 font-jetbrains-mono">
						scroll or <a href="/" className="text-emerald-500 hover:text-emerald-400 ml-1">see all</a>
					</div>
				</div>

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	);
}
