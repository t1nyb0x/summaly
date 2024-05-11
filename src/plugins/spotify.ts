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
	const originalUrl = new URL(url.href);
	if (url.hostname === 'spotify.link') url.hostname = 'spotify.app.link';
	const summary = await general(url);
	originalUrl.href = summary.url;

	// build oEmbed url
	const oEmbedUrl = new URL('https://open.spotify.com/oembed');
	oEmbedUrl.searchParams.append('url', originalUrl.href);

	// get oEmbed
	const oEmbedResponse = await getJson(oEmbedUrl.href, 'https://spotify.com') as OEmbed;
	// parse
	const $ = cheerio.load(oEmbedResponse.html);

	const playerUrl = $('iframe').attr('src');
	if (!playerUrl?.match(/^https?:\/\//)) throw 'Invalid player URL';

	return {
		title: oEmbedResponse.title ?? null,
		description: summary.description,
		icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
		sitename: oEmbedResponse.provider_name ?? null,
		thumbnail: oEmbedResponse.thumbnail_url ?? null,
		player: {
			url: playerUrl,
			width: oEmbedResponse.width,
			height: oEmbedResponse.height,
		},
		url: originalUrl.href,
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
