import { audioToText } from '../llms/audio-to-text';
import { extractValues } from '../llms/extract-values';

export async function handleAudio(env: Env, audioBuffer: ArrayBuffer) {
	return await audioToText(env, audioBuffer);
}

export async function handleExtraction(env: Env, text: string, now: string) {
	const schedule = await extractValues(env, text, now);
	console.log(schedule, 'schedule.');
	return schedule;
}
