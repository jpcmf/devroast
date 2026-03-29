import { Button } from "@/components";
import Link from "next/link";
import { submissions } from "@/data/submissions";

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
						<span>total submissions: {submissions.length}</span>
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

						{/* Table Rows - Now clickable with links */}
						<div>
							{submissions.map((item) => (
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

					{/* Footer Stats */}
					<div className="flex items-center justify-center py-6 text-xs text-gray-600 font-jetbrains-mono">
						showing {submissions.length} of {submissions.length}
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
