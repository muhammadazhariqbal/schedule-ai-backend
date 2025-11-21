export interface TranscribedWord {
	word: string;
	start: number; // seconds
	end: number; // seconds
}

export interface TranscriptionResult {
	text: string;
	word_count?: number;
	words?: TranscribedWord[];
	vtt?: string;
}

export async function audioToText(env: Env, audioBuffer: ArrayBuffer) {
	try {
		// will receive audio buffer and return a text
		const input = {
			audio: [...new Uint8Array(audioBuffer)],
		};

		const response = await env.AI.run('@cf/openai/whisper', input);

		const result: TranscriptionResult = {
			text: response.text || '',
			word_count: response.words?.length,
			words: response.words?.map((w: any) => ({
				word: w.word,
				start: w.start,
				end: w.end,
			})),
			vtt: response.vtt || '',
		};

		return result;
	} catch (e) {
		throw new Error(`Something went wrong during env.AI call for audio to text:${e}`);
	}
}
