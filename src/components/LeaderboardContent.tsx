'use client'

import { useState } from "react";
import { useEffect } from "react";
import { LeaderboardTable } from "./LeaderboardTable";
import { Button } from "./ui";
import { trpc } from "@/lib/trpc";

interface LeaderboardData {
	items: Array<{
		id: string;
		rank: number;
		score: string;
		code: string;
		language: string;
		createdAt: Date;
	}>;
	pagination: {
		page: number;
		pageSize: number;
		totalCount: number;
		totalPages: number;
	};
}

/**
 * Client component that manages leaderboard pagination
 * Used within Suspense boundary in the leaderboard page
 */
export function LeaderboardContent({ initialData }: { initialData: LeaderboardData }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState(initialData);
	const [isLoading, setIsLoading] = useState(false);

	const pageSize = 10;

	const handlePageChange = async (newPage: number) => {
		if (newPage < 1 || newPage > data.pagination.totalPages) return;

		setIsLoading(true);
		try {
			const result = await trpc.metrics.getLeaderboard.query({ 
				page: newPage, 
				pageSize 
			});

			if (result) {
				// Convert createdAt strings to Date objects
				const convertedResult = {
					...result,
					items: result.items.map(item => ({
						...item,
						createdAt: new Date(item.createdAt)
					}))
				};
				setData(convertedResult);
				setCurrentPage(newPage);
				// Scroll to top
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		} catch (error) {
			console.error("Failed to fetch leaderboard:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const { items, pagination } = data;

	return (
		<div className="space-y-6">
			{/* Leaderboard Table */}
			<LeaderboardTable items={items} totalCount={pagination.totalCount} />

			{/* Pagination Controls */}
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between gap-4 flex-wrap">
					{/* Page Info */}
					<p className="text-sm text-gray-400 font-jetbrains-mono">
						page {pagination.page} of {pagination.totalPages} • {pagination.totalCount} total
					</p>

					{/* Pagination Buttons */}
					<div className="flex gap-2">
						<Button
							variant={currentPage === 1 ? "ghost" : "secondary"}
							size="sm"
							disabled={currentPage === 1 || isLoading}
							onClick={() => handlePageChange(currentPage - 1)}
						>
							previous
						</Button>

						{/* Page Numbers */}
						<div className="flex gap-1">
							{Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
								.filter((page) => {
									// Show current page and adjacent pages
									const diff = Math.abs(page - currentPage);
									return diff === 0 || diff === 1 || page === 1 || page === pagination.totalPages;
								})
								.map((page, idx, arr) => {
									// Add ellipsis if there's a gap
									const prevPage = arr[idx - 1];
									const showEllipsis = prevPage && page - prevPage > 1;

									return (
										<div key={`page-${page}`} className="flex gap-1 items-center">
											{showEllipsis && <span className="text-gray-500">...</span>}
											<Button
												variant={page === currentPage ? "primary" : "ghost"}
												size="sm"
												disabled={isLoading}
												onClick={() => handlePageChange(page)}
												className="w-8 h-8 p-0 flex items-center justify-center"
											>
												{page}
											</Button>
										</div>
									);
								})}
						</div>

						<Button
							variant={currentPage === pagination.totalPages ? "ghost" : "secondary"}
							size="sm"
							disabled={currentPage === pagination.totalPages || isLoading}
							onClick={() => handlePageChange(currentPage + 1)}
						>
							next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
