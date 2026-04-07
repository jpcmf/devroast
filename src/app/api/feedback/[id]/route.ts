import { getLatestFeedbackBySubmissionId } from '@/db/queries/feedback'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing submission ID' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		const feedback = await getLatestFeedbackBySubmissionId(id)

		if (!feedback) {
			return new Response(JSON.stringify(null), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		return new Response(JSON.stringify(feedback), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Error fetching feedback:', error)
		return new Response(JSON.stringify({ error: 'Failed to fetch feedback' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
