import { Button } from "@/components";
import Link from "next/link";

// Static leaderboard data - can be replaced with dynamic data later
const leaderboardData = [
	{ rank: 1, score: "1.2", code: 'eval(prompt("enter code"))', lang: "javascript" },
	{ rank: 2, score: "1.8", code: "if (x == true) { return true; }", lang: "typescript" },
	{ rank: 3, score: "2.1", code: "SELECT * FROM users WHERE 1=1", lang: "sql" },
	{ rank: 4, score: "2.3", code: "var globalVar = 'bad practice'", lang: "javascript" },
	{ rank: 5, score: "2.5", code: "catch (e) { }", lang: "javascript" },
	{ rank: 6, score: "2.7", code: 'setTimeout(() => {...}, 0)', lang: "javascript" },
	{ rank: 7, score: "2.9", code: "async function() { return }", lang: "python" },
	{ rank: 8, score: "3.1", code: "document.write('<div>...</div>')", lang: "javascript" },
	{ rank: 9, score: "3.3", code: "==== badly formatted ====", lang: "javascript" },
	{ rank: 10, score: "3.5", code: "var x = 1; var x = 2;", lang: "javascript" },
	{ rank: 11, score: "3.7", code: "function deepCopy(obj) { ... }", lang: "javascript" },
	{ rank: 12, score: "3.9", code: "for(let i=0;i<array.length;i++)", lang: "javascript" },
	{ rank: 13, score: "4.1", code: "const fn = () => { ... }", lang: "javascript" },
	{ rank: 14, score: "4.3", code: "if (condition) doSomething()", lang: "python" },
	{ rank: 15, score: "4.5", code: "try { ... } catch(...) { ... }", lang: "javascript" },
];

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen">
			{/* Main Content */}
			<main className="flex flex-col items-center gap-8 px-10 py-20">
				{/* Header Section */}
				<div className="w-full max-w-3xl space-y-6">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-gray-100 font-jetbrains-mono">
							<span className="text-emerald-500">{`$ `}</span>
							shame leaderboard
						</h1>
						<p className="text-sm text-gray-400 font-jetbrains-mono">
							{`// the worst code on the internet, ranked by shame`}
						</p>
					</div>

					{/* Stats */}
					<div className="flex items-center justify-between text-xs text-gray-500 font-jetbrains-mono border-l-2 border-emerald-500 pl-4">
						<span>total submissions: {leaderboardData.length}</span>
						<span>avg score: 3.1/10</span>
					</div>
				</div>

				{/* Leaderboard Table */}
				<div className="w-full max-w-3xl">
					<div className="border border-gray-700 bg-gray-900 overflow-hidden rounded-lg">
						{/* Table Header */}
						<div className="flex items-center border-b border-gray-700 bg-gray-800 px-5 text-xs font-bold text-gray-400 font-jetbrains-mono h-10">
							<div className="w-12">#</div>
							<div className="w-[70px]">score</div>
							<div className="flex-1">code</div>
							<div className="w-[100px]">lang</div>
						</div>

						{/* Table Rows */}
						<div>
							{leaderboardData.map((item) => (
								<div
									key={item.rank}
									className="flex items-center border-b border-gray-700 px-5 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors h-12 cursor-pointer"
								>
									<div className="w-12 font-bold text-gray-500">{item.rank}</div>
									<div className="w-[70px] font-bold text-red-400">{item.score}</div>
									<div className="flex-1 text-gray-300 truncate">{item.code}</div>
									<div className="w-[100px] text-gray-500">{item.lang}</div>
								</div>
							))}
						</div>
					</div>

					{/* Footer Stats */}
					<div className="flex items-center justify-center py-6 text-xs text-gray-600 font-jetbrains-mono">
						showing {leaderboardData.length} of {leaderboardData.length}
					</div>
				</div>

				{/* CTA Section */}
				<div className="w-full max-w-3xl flex flex-col items-center gap-6">
					<div className="text-center space-y-2">
						<p className="text-sm text-gray-400 font-jetbrains-mono">
							see your code here? submit your worst code for review
						</p>
					</div>
					<Link href="/">
						<Button variant="primary" size="md">
							{`$ submit_my_code`}
						</Button>
					</Link>
				</div>

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	);
}
