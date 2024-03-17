import cleanupTitle from './utils/cleanup-title';
import { decodeEntities } from './utils/decode-entities';
import { SummalyEx } from './summaly';
import { scpaping } from './utils/got';
import { cleanupUrl } from './utils/cleanup-url';

export default async (url: URL, lang: string | null = null, useRange = false): Promise<SummalyEx> => {
	if (lang && !lang.match(/^[\w-]+(\s*,\s*[\w-]+)*$/)) lang = null;

	const res = await scpaping(url.href, { lang: lang || undefined, useRange });
	const $ = res.$;
	const landingUrl = new URL(res.response.url);

	if (res.pdf) {
		const result = {
			title: res.pdf.title ?? 'PDF Document',
			icon: `data:image/png;base64,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`,
			description: null,
			thumbnail: null,
			medias: undefined,
			player: {
				url: null,
				width: null,
				height: null
			},
			sitename: landingUrl.hostname ?? null,
			sensitive: false,
			url: landingUrl.href,
			$,
		} as SummalyEx;
	
		return result;
	}

	if (!$) throw new Error('unex 1');

	const twitterCard =
		$('meta[name="twitter:card"]').attr('content') ??
		$('meta[property="twitter:card"]').attr('content');

	let title: string | null =
		$('meta[name="twitter:title"]').attr('content') ??
		$('meta[property="twitter:title"]').attr('content') ??
		$('meta[property="og:title"]').attr('content') ??
		$('title').text() ??
		null;
	title = decodeEntities(title, 300);

	let image =
		$('meta[name="twitter:image"]').attr('content') ??
		$('meta[property="twitter:image"]').attr('content') ??
		$('meta[property="og:image"]').attr('content') ??
		$('link[rel="image_src"]').attr('href') ??
		$('link[rel="apple-touch-icon"]').attr('href') ??
		$('link[rel="apple-touch-icon image_src"]').attr('href') ??
		null;

	image = cleanupUrl(image, landingUrl.href);

	let playerUrl =
		(twitterCard !== 'summary_large_image' ? $('meta[name="twitter:player"]').attr('content') : null) ??
		(twitterCard !== 'summary_large_image' ? $('meta[property="twitter:player"]').attr('content') : null) ??
		$('meta[property="og:video"]').attr('content') ??
		$('meta[property="og:video:secure_url"]').attr('content') ??
		$('meta[property="og:video:url"]').attr('content') ??
		null;

	playerUrl = cleanupUrl(playerUrl, landingUrl.href);

	const playerWidth = parseInt(
		$('meta[name="twitter:player:width"]').attr('content') ??
		$('meta[property="twitter:player:width"]').attr('content') ??
		$('meta[property="og:video:width"]').attr('content') ??
		'');

	const playerHeight = parseInt(
		$('meta[name="twitter:player:height"]').attr('content') ??
		$('meta[property="twitter:player:height"]').attr('content') ??
		$('meta[property="og:video:height"]').attr('content') ??
		'');

	let description =
		$('meta[name="twitter:description"]').attr('content') ??
		$('meta[property="twitter:description"]').attr('content') ??
		$('meta[property="og:description"]').attr('content') ??
		$('meta[name="description"]').attr('content') ??
		null;

	description = decodeEntities(description, 300);

	if (title === description) {
		description = null;
	}

	let siteName: string | null =
		$('meta[property="og:site_name"]').attr('content') ??
		$('meta[name="application-name"]').attr('content') ??
		landingUrl.hostname ??
		null;

	siteName = decodeEntities(siteName, 300);

	const favicon =
		$('link[rel="shortcut icon"]').attr('href') ??
		$('link[rel="icon"]').attr('href') ??
		null;

	const icon = cleanupUrl(favicon, landingUrl.href);

	const sensitive = $('.tweet').attr('data-possibly-sensitive') === 'true';

	// Clean up the title
	title = cleanupTitle(title, siteName);

	if (title === '') {
		title = siteName;
	}

	const result = {
		title,
		icon,
		description,
		thumbnail: image,
		medias: image ? [image] : undefined,
		player: {
			url: playerUrl,
			width: Number.isNaN(playerWidth) ? null : playerWidth,
			height: Number.isNaN(playerHeight) ? null : playerHeight
		},
		sitename: siteName,
		sensitive,
		url: landingUrl.href,
		$,
	} as SummalyEx;

	return result;
};
