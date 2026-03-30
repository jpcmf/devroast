import Link from 'next/link'

interface LeaderboardItem {
	id: string
	rank: number
	score: string
	code: string
	language: string
}

interface LeaderboardTableProps {
	items: LeaderboardItem[]
	totalCount: number
}

/**
 * Server component that renders the leaderboard table
 * Receives fetched data from parent server component
 */
export function LeaderboardTable({ items, totalCount }: LeaderboardTableProps) {
	return (
		<>
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
					{items.map((item) => (
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
				showing {items.length} of {totalCount}
			</div>
		</>
	)
}
