// 高速YouTubeプラグイン
import { getJson } from '../utils/got';
import { Summaly } from '../summaly';
import * as cheerio from 'cheerio';

export function test(url: URL): boolean {
	if (url.hostname.match(/^(?:.+[.])?youtube[.]com$/)) {
		if (url.pathname.match(/^[/](?:watch|v|playlist|shorts)/)) {
			return true;
		}
	}

	if (url.hostname.match(/^youtu[.]be$/)) {
		return true;
	}

	return false;
}

export async function process(url: URL): Promise<Summaly> {
	// build oEmbed url
	const u = new URL('https://www.youtube.com/oembed');
	u.searchParams.append('url', url.href);
	console.log(u.href);

	// get oEmbed
	const j = await getJson(u.href, 'https://www.youtube.com') as OEmbed;

	// parse
	if (j.type !== 'video') throw 'invalid type';
	const $ = cheerio.load(j.html);

	const src = $('iframe').attr('src');
	if (!src?.match(/^https?:[/][/]/)) throw 'invalid src';

	return {
		title: j.title ?? null,
		description: null,
		icon: 'https://www.youtube.com/s/desktop/014dbbed/img/favicon_32x32.png',
		sitename: j.provider_name ?? null,
		thumbnail: j.thumbnail_url ?? null,
		player: {
			url: src,
			width: j.width,
			height: j.height,
		},
		url: url.href,
	};
}

type OEmbed = {
	type: 'video',
	version: '1.0',
	title?: string;
	author_name?: string;
	author_url?: string;
	provider_name?: string;
	provider_url?: string;
	cache_age?: number; // in sec
	thumbnail_url?: string;
	thumbnail_height: number,
	thumbnail_width: number,
	html: string;
	height: number,
	width: number,
};
