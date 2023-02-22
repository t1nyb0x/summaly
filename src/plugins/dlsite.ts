import { SummalyEx } from '../summaly';

export function test(url: URL): boolean {
	return url.hostname === 'www.dlsite.com';
}

export async function postProcess(summaly: SummalyEx): Promise<SummalyEx> {
	const landingUrl = summaly.url;

	if (!landingUrl.match(/[/](?:home|comic|soft|app)[/]/)) summaly.sensitive = true;

	return summaly;
}
