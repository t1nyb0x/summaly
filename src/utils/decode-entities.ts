import clip from './clip';
import { AllHtmlEntities } from 'html-entities';
const entities = new AllHtmlEntities();

export function decodeEntities(description: string | null | undefined, limit = 300): string | null {
	return description
		? (clip(entities.decode(description), limit) || null)
		: null;
}
