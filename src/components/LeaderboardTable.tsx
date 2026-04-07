'use client'

import Link from "next/link";
import { LeaderboardCodeBlock } from "@/components/ui";

interface LeaderboardItem {
	id: string;
	rank: number;
	score: string;
	code: string;
	language: string;
}

interface LeaderboardTableProps {
	items: LeaderboardItem[];
	totalCount: number;
}

/**
 * Client component that renders the leaderboard table with syntax highlighted code
 * Receives fetched data from parent component
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
							<div className="flex items-start gap-3 border-b border-gray-700 px-5 py-3 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors cursor-pointer">
								{/* Rank */}
								<div className="w-12 font-bold text-gray-500 flex-shrink-0 pt-1">
									{item.rank}
								</div>

								{/* Score */}
								<div className="w-[70px] font-bold text-red-400 flex-shrink-0 pt-1">
									{item.score}
								</div>

								{/* Code with syntax highlighting and scroll */}
								<div className="flex-1 min-w-0">
									<LeaderboardCodeBlock
										code={item.code}
										language={item.language}
										maxHeight="max-h-[120px]"
									/>
								</div>

								{/* Language */}
								<div className="w-[100px] text-gray-500 flex-shrink-0 pt-1">
									{item.language}
								</div>
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
	);
}
