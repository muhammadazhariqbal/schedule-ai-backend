import { SYSTEM_PROMPT, USER_PROMPT } from '../../prompts/extract-schedule';

export async function extractValues(env: Env, text: string, now: string) {
	const response = await env.AI.run('@cf/openai/gpt-oss-120b', {
		reasoning_effort: 'medium',
		summary: 'concise',
		effort: 'low',
		input: [
			{
				role: 'system',
				content: SYSTEM_PROMPT,
			},
			{
				role: 'user',
				content: JSON.stringify({
					current_datetime: now,
					text: text,
				}),
			},
		],
	});

	return response;
}
