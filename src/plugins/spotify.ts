import { getJson } from '../utils/got';
import { Summaly } from '../summaly';
import * as cheerio from 'cheerio';
import { scpaping } from '../utils/got';

export function test(url: URL): boolean {
	if (url.hostname === 'open.spotify.com' || url.hostname === 'spotify.link' || url.hostname === 'spotify.app.link') {
		return true;
	}
	return false;
}

export async function process(url: URL, lang: string | null = null, useRange = false): Promise<Summaly> {
	if (url.hostname.indexOf('spotify.link') === 0 || url.hostname.indexOf('spotify.app.link') === 0) {
		if (url.hostname === 'spotify.link') {
			url.hostname = 'spotify.app.link';
		}

		const scrapingResult = await scpaping(url.href, { lang: lang || undefined, useRange });

		if (!scrapingResult.$) {
			throw new Error('Scraping failed');
		}

		let openSpotifyUrl = scrapingResult.$('a.secondary-action').attr('href');
		if (!openSpotifyUrl) {
			openSpotifyUrl = url.href;
		}

		url.href = openSpotifyUrl;
	}
	
	const oEmbedUrl = new URL('https://open.spotify.com/oembed');
	oEmbedUrl.searchParams.append('url', url.href);
	
	const oEmbedResponse = await getJson(oEmbedUrl.href, 'https://spotify.com') as OEmbed;
	
	const $ = cheerio.load(oEmbedResponse.html);

	const playerUrl = $('iframe').attr('src');
	if (!playerUrl?.match(/^https?:\/\//)) throw 'Invalid player URL';

	return {
		title: oEmbedResponse.title ?? null,
		description: oEmbedResponse.description ?? null,
		icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
		sitename: oEmbedResponse.provider_name ?? null,
		thumbnail: oEmbedResponse.thumbnail_url ?? null,
		player: {
			url: playerUrl,
			width: oEmbedResponse.width,
			height: oEmbedResponse.height,
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
	cache_age?: number;
	description?: string;
	thumbnail_url?: string;
	thumbnail_height: number,
	thumbnail_width: number,
	html: string;
	height: number,
	width: number,
};