import Link from "next/link";
import { CodeEditorSection } from "@/components/CodeEditorSection";
import { HomeMetricsSection } from "@/components/HomeMetricsSection";
import { HomeLeaderboardSection } from "@/components/HomeLeaderboardSection";

// Skip static prerendering - fetch data dynamically at request time
export const dynamic = 'force-dynamic'

// Make this a server component
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
				<CodeEditorSection />

				{/* Metrics Section with Suspense */}
				<HomeMetricsSection />

				{/* Spacer */}
				<div className="h-12" />

				{/* Leaderboard Preview Section with Suspense */}
				<HomeLeaderboardSection />

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	);
}
