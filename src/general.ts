import cleanupTitle from './utils/cleanup-title';
import { decodeEntities } from './utils/decode-entities';
import { SummalyEx } from './summaly';
import { createInstance } from './client';

export default async (url: URL, lang: string | null = null): Promise<SummalyEx> => {
	if (lang && !lang.match(/^[\w-]+(\s*,\s*[\w-]+)*$/)) lang = null;

	const client = createInstance();

	(client as any).set('headers', {
		'Accept-Language': lang
	});

	const res = await client.fetch(url.href).catch((e: any) => {
		throw `${e.statusCode || e.message}`;
	});

	const contentType = res.response.headers['content-type'];

	// HTMLじゃなかった場合は中止
	if (!contentType?.includes('text/html')) {
		throw `not html ${contentType}`;
	}

	const $ = res.$;

	const landingUrl = new URL($.documentInfo().url);

	let title =
		$('meta[property="og:title"]').attr('content') ||
		$('meta[property="twitter:title"]').attr('content') ||
		$('title').text() ||
		null;

	if (title == null) {
		throw 'no title';
	}

	title = decodeEntities(title, 300);

	let image =
		$('meta[property="og:image"]').attr('content') ||
		$('meta[property="twitter:image"]').attr('content') ||
		$('link[rel="image_src"]').attr('href') ||
		$('link[rel="apple-touch-icon"]').attr('href') ||
		$('link[rel="apple-touch-icon image_src"]').attr('href') ||
		null;

	image = image ?  new URL(image, landingUrl.href).href : null;

	const playerUrl =
		$('meta[property="twitter:player"]').attr('content') ||
		$('meta[name="twitter:player"]').attr('content') ||
		$('meta[property="og:video"]').attr('content') ||
		$('meta[property="og:video:secure_url"]').attr('content') ||
		$('meta[property="og:video:url"]').attr('content') ||
		null;

	const playerWidth = parseInt(
		$('meta[property="twitter:player:width"]').attr('content') ||
		$('meta[name="twitter:player:width"]').attr('content') ||
		$('meta[property="og:video:width"]').attr('content') ||
		'');

	const playerHeight = parseInt(
		$('meta[property="twitter:player:height"]').attr('content') ||
		$('meta[name="twitter:player:height"]').attr('content') ||
		$('meta[property="og:video:height"]').attr('content') ||
		'');

	let description =
		$('meta[property="og:description"]').attr('content') ||
		$('meta[property="twitter:description"]').attr('content') ||
		$('meta[name="description"]').attr('content') ||
		null;

	description = decodeEntities(description, 300);

	if (title === description) {
		description = null;
	}

	let siteName =
		$('meta[property="og:site_name"]').attr('content') ||
		$('meta[name="application-name"]').attr('content') ||
		landingUrl.hostname ||
		null;

	siteName = decodeEntities(siteName, 300);

	const favicon =
		$('link[rel="shortcut icon"]').attr('href') ||
		$('link[rel="icon"]').attr('href') ||
		'/favicon.ico';

	const icon = favicon ? new URL(favicon, landingUrl.href).href : null;

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
