interface ScheduleItem {
	date: string;
	time: string;
	task: string;
	notes: string;
}

interface ScheduleResponse {
	[day: string]: ScheduleItem;
}

interface ParsedScheduleResult {
	schedule: ScheduleResponse | null;
	usage?: {
		prompt_tokens?: number;
		completion_tokens?: number;
		total_tokens?: number;
	};
}

export function parseScheduleResponse(result: { response?: string; usage?: any }): ParsedScheduleResult {
	let schedule: ScheduleResponse | null = null;

	try {
		if (result.response) {
			// Remove newlines, trim spaces
			let cleaned = result.response.replace(/\n/g, '').trim();

			// Sometimes AI returns double-escaped quotes, fix them
			cleaned = cleaned.replace(/\\"/g, '"');

			// Remove leading/trailing quotes if the whole string is quoted
			if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
				cleaned = cleaned.slice(1, -1);
			}

			schedule = JSON.parse(cleaned) as ScheduleResponse;
		} else {
			console.warn('No response field in result');
		}
	} catch (error) {
		console.error('Failed to parse schedule response:', error, '\nRaw response:', result.response);
	}

	return {
		schedule,
		usage: result.usage,
	};
}
