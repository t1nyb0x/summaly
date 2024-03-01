import { Summaly } from '../summaly';
import general from '../general';
import { StatusError } from '../utils/status-error';

export function test(url: URL): boolean {
	return url.hostname === 'www.dlsite.com';
}

export async function process(url: URL): Promise<Summaly> {
	const summaly = await general(url).catch(e => {
		if (e instanceof StatusError && e.statusCode === 404) {
			let pathname;
			if (url.pathname.match(/^[/]\w+[/]announce[/]/)) {
				pathname = url.pathname.replace('/announce/', '/work/');
			} else if (url.pathname.match(/^[/]\w+[/]work[/]/)) {
				pathname = url.pathname.replace('/work/', '/announce/');
			} else {
				throw e;
			}

			const u = new URL(url);
			u.pathname = pathname;

			return general(u);
		}

		throw e;
	});

	const landingUrl = summaly.url;
	console.log(landingUrl);
	if (!landingUrl.match(/[/](?:home|comic|soft|app|ai)[/]/)) summaly.sensitive = true;
	return summaly;
}
