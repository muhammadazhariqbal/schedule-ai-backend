import { handleAudio, handleExtraction } from './scheduler';
import { parseScheduleResponse } from './utils/parse';

export default {
	async fetch(request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/audio-to-text') {
			const audioBuffer = await request.arrayBuffer(); // Only read as arrayBuffer
			console.log(audioBuffer, 'audio buffer');
			const result = await handleAudio(env, audioBuffer);
			return new Response(JSON.stringify(result), { status: 200 });
		}

		if (url.pathname === '/extract-values') {
			const value: { text: string; now: string } = await request.json(); // Only read as JSON

			const result = await handleExtraction(env, value.text, value.now); // your extraction function

			return new Response(JSON.stringify(result), { status: 200 });
		}

		return new Response('running...');
	},
} satisfies ExportedHandler<Env>;
