export interface Env {
	AI: Ai;
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname == '/audio-to-text') {
			return new Response('do audio to text action ', { status: 200 });
		}
		if (url.pathname == '/extract-values') {
			return new Response('do extract actions ', { status: 200 });
		}
		return new Response('invalid address');
	},
} satisfies ExportedHandler<Env>;
