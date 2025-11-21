import { audioToText } from '../llms/audio-to-text';
import { extractValues } from '../llms/extract-values';

export async function handleAudio(env: Env, audioBuffer: ArrayBuffer) {
	try {
		const textResponse = await audioToText(env, audioBuffer);
		return textResponse;
	} catch (e: any) {
		throw new Error(e?.message || String(e));
	}
}

export async function handleExtraction(env: Env, text: string, now: string) {
	try {
		const scheduleResponse = await extractValues(env, text, now);
		return scheduleResponse;
	} catch (e: any) {
		throw new Error(e?.message || String(e));
	}
}
