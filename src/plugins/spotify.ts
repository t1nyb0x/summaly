import { getJson } from '../utils/got';
import { Summaly } from '../summaly';
import * as cheerio from 'cheerio';
import general from '../general';

export function test(url: URL): boolean {
	if (url.hostname === 'open.spotify.com' || url.hostname === 'spotify.link' || url.hostname === 'spotify.app.link') {
		return true;
	}

	return false;
}

export async function process(url: URL): Promise<Summaly> {
	// get summary
	const summary = await general(url);
	url.href = summary.url; 

	// build oEmbed url
	const u = new URL('https://open.spotify.com/oembed');
	u.searchParams.append('url', url.href);

	// get oEmbed
	const j = await getJson(u.href, 'https://spotify.com') as OEmbed;

	// parse
	const $ = cheerio.load(j.html);

	const src = $('iframe').attr('src');
	if (!src?.match(/^https?:[/][/]/)) throw 'invalid src';

	return {
		title: j.title ?? null,
		description: summary.description,
		icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
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
