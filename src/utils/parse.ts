/**
 * Extracts tasks, date, and usage from a Cloudflare Worker LLM response.
 * @param {object} response - Full API response from Cloudflare AI Worker
 * @returns {object} - Minimal client-friendly object { tasks, date, usage }
 */
export function extractReminderData(response: any) {
	if (!response || typeof response !== 'object') {
		return { tasks: null, date: null, usage: null };
	}

	// Safely find the assistant message containing the final JSON
	const messageOutput = Array.isArray(response.output) ? response.output.find((o: any) => o.type === 'message') : null;

	// Safely access the text content
	const jsonString = messageOutput?.content?.[0]?.text;

	let reminderData = null;
	try {
		if (jsonString) {
			reminderData = JSON.parse(jsonString);
		}
	} catch (err) {
		console.warn('Failed to parse JSON from output_text:', err);
	}

	// Extract usage safely
	const usageData = response.usage || null;

	return {
		tasks: reminderData?.tasks || null,
		date: reminderData?.date || null,
		usage: usageData,
		created_at: response.created_at,
	};
}
