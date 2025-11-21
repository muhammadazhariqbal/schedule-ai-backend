import { handleAudio, handleExtraction } from './scheduler';
import { extractReminderData } from './utils/parse';

export default {
	async fetch(request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		try {
			if (url.pathname === '/audio-to-text') {
				const audioBuffer = await request.arrayBuffer(); // Only read as arrayBuffer
				console.log(audioBuffer, 'audio buffer');
				const result = await handleAudio(env, audioBuffer);
				return new Response(JSON.stringify(result), { status: 200 });
			}

			if (url.pathname === '/extract-values') {
				const value: { text: string; now: string } = await request.json();

				const response = await handleExtraction(env, value.text, value.now);

				// --- Example usage ---
				const clientResponse = extractReminderData(response);
				console.log(clientResponse);

				return new Response(JSON.stringify(clientResponse), { status: 200 });
			}

			return new Response('running...');
		} catch (e: any) {
			console.error('Error in fetch handler:', e);
			return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
