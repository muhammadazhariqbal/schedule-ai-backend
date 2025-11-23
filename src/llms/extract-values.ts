import { SYSTEM_PROMPT } from '../../prompts/extract-task';

export async function extractValues(env: Env, text: string, now: string) {
	try {
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
	} catch (e) {
		throw new Error(`Something went wrong during env.AI call for extracting schedule from text:${e}`);
	}
}
