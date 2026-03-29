import Link from "next/link";
import { Suspense } from "react";
import { MetricsSection } from "@/components/metrics-section";
import { getLeaderboardPreview } from "@/data/submissions";
import { CodeEditorWrapper } from "./code-editor-wrapper";

export default function Home() {
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
					<CodeEditorWrapper />

					{/* Footer Stats */}
					<div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-jetbrains-mono">
						<Suspense fallback={<span>loading metrics...</span>}>
							<MetricsSection />
						</Suspense>
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
							{getLeaderboardPreview(3).map((item) => (
								<Link key={item.id} href={`/results/${item.id}`}>
									<div className="flex items-center border-b border-gray-700 px-5 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors h-12 cursor-pointer">
										<div className="w-12 font-bold text-gray-500">{item.rank}</div>
										<div className="w-[70px] font-bold text-red-400">{item.score}</div>
										<div className="flex-1 text-gray-300 truncate">{item.code}</div>
										<div className="w-[100px] text-gray-500">{item.language}</div>
									</div>
								</Link>
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
