import { audioToText } from '../llms/audio-to-text';
import { extractValues } from '../llms/extract-values';

export async function handleAudio(env: Env, audioBuffer: ArrayBuffer) {
	const text = await audioToText(env, audioBuffer);
	return text;
}

export async function handleExtraction(env: Env, text: string) {
	const schedule = await extractValues(env, text);
	return schedule;
}
