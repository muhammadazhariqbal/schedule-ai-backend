import { SYSTEM_PROMPT, USER_PROMPT } from '../../prompts/extract-schedule';

export async function extractValues(env: Env, text: string, now: string) {
	const response = await env.AI.run('@cf/meta/llama-3.2-1b-instruct', {
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content: USER_PROMPT(text, now) },
		],
	});

	return response;
}
