import { handleAudio } from './scheduler';

export default {
	async fetch(request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const audioBuffer = await request.arrayBuffer();
		if (url.pathname == '/audio-to-text') {
			console.log(audioBuffer, 'audio buffer');
			const result = await handleAudio(env, audioBuffer);
			return new Response(JSON.stringify(result), { status: 200 });
		}
		if (url.pathname == '/extract-values') {
			return new Response('do extract actions ', { status: 200 });
		}
		if (url.pathname == '/test') {
			const res = await fetch(
				'https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/samples/cpp/windows/console/samples/enrollment_audio_katie.wav'
			);
			const blob = await res.arrayBuffer();

			const input = {
				audio: [...new Uint8Array(blob)],
			};

			const response = await env.AI.run('@cf/openai/whisper', input);

			return Response.json({ input: { audio: [] }, response });
		}
		return new Response('invalid address');
	},
} satisfies ExportedHandler<Env>;
