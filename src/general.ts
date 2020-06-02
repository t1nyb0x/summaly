import { name, version } from '../package.json';
import * as URL from 'url';
import fetch from 'node-fetch';
import { httpAgent, httpsAgent } from './utils/agent';
import clip from './utils/clip';
import cleanupTitle from './utils/cleanup-title';

import { AllHtmlEntities } from 'html-entities';
const entities = new AllHtmlEntities();

import * as client from 'cheerio-httpcli';

// 単一インスタンスなのでamazonと値を揃えないといけない
client.set('headers', {
	'User-Agent': `SummalyBot/${version}`
});
client.set('referer', false);
client.set('timeout', 20000);
client.set('maxDataSize', 10 * 1024 * 1024);

import Summary from './summary';

export default async (url: URL.Url, lang: string = null): Promise<Summary> => {
	if (lang && !lang.match(/^[\w-]+(\s*,\s*[\w-]+)*$/)) lang = null;

	client.set('headers', {
		'Accept-Language': lang
	});

	const res = await client.fetch(url.href).catch((e: any) => {
		throw `${e.statusCode || e.message}`;
	});

	const contentType: string = res.response.headers['content-type'];

	// HTMLじゃなかった場合は中止
	if (contentType.indexOf('text/html') === -1) {
		throw `not html ${contentType}`;
	}

	const $ = res.$;

	let title =
		$('meta[property="og:title"]').attr('content') ||
		$('meta[property="twitter:title"]').attr('content') ||
		$('title').text();

	if (title === undefined || title === null) {
		throw 'no title';
	}

	title = clip(entities.decode(title), 100);

	let image =
		$('meta[property="og:image"]').attr('content') ||
		$('meta[property="twitter:image"]').attr('content') ||
		$('link[rel="image_src"]').attr('href') ||
		$('link[rel="apple-touch-icon"]').attr('href') ||
		$('link[rel="apple-touch-icon image_src"]').attr('href');

	image = image ? URL.resolve(url.href, image) : null;

	const playerUrl =
		$('meta[property="twitter:player"]').attr('content') ||
		$('meta[name="twitter:player"]').attr('content');

	const playerWidth = parseInt(
		$('meta[property="twitter:player:width"]').attr('content') ||
		$('meta[name="twitter:player:width"]').attr('content'));

	const playerHeight = parseInt(
		$('meta[property="twitter:player:height"]').attr('content') ||
		$('meta[name="twitter:player:height"]').attr('content'));

	let description =
		$('meta[property="og:description"]').attr('content') ||
		$('meta[property="twitter:description"]').attr('content') ||
		$('meta[name="description"]').attr('content');

	description = description
		? clip(entities.decode(description), 300)
		: null;

	if (title === description) {
		description = null;
	}

	let siteName =
		$('meta[property="og:site_name"]').attr('content') ||
		$('meta[name="application-name"]').attr('content') ||
		url.hostname;

	siteName = siteName ? entities.decode(siteName) : null;

	const favicon =
		$('link[rel="shortcut icon"]').attr('href') ||
		$('link[rel="icon"]').attr('href') ||
		'/favicon.ico';

	const sensitive = $('.tweet').attr('data-possibly-sensitive') === 'true';

	const find = async (path: string) => {
		const target = URL.resolve(url.href, path);
		return await fetch(url, {
			method: 'head',
			timeout: 10 * 1000,
			agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent
		})
		.then(res => res.status === 200 ? target : null)
		.catch(() => null);
	};

	// 相対的なURL (ex. test) を絶対的 (ex. /test) に変換
	const toAbsolute = (relativeURLString: string): string => {
		const relativeURL = URL.parse(relativeURLString);
		const isAbsolute = relativeURL.slashes || relativeURL.path[0] === '/';

		// 既に絶対的なら、即座に値を返却
		if (isAbsolute) {
			return relativeURLString;
		}

		// スラッシュを付けて返却
		return '/' + relativeURLString;
	};

	const icon = await find(favicon) ||
		// 相対指定を絶対指定に変換し再試行
		await find(toAbsolute(favicon)) ||
		null;

	// Clean up the title
	title = cleanupTitle(title, siteName);

	if (title === '') {
		title = siteName;
	}

	return {
		title: title || null,
		icon: icon || null,
		description: description || null,
		thumbnail: image || null,
		player: {
			url: playerUrl || null,
			width: playerWidth || null,
			height: playerHeight || null
		},
		sitename: siteName || null,
		sensitive,
	};
};
