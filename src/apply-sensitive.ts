import fetch from 'node-fetch';
import { Summaly } from './summaly';
import { httpAgent, httpsAgent } from './utils/agent';
import { browserUA } from './client';

export async function applySensitive(summary: Summaly): Promise<Summaly> {
	if (summary.sensitive) return summary;
	if (!summary.url) return summary;

	const landingUrl = summary.url;

	if (landingUrl.match(/\/\/fantia.jp\//)) {
		const m = landingUrl.match(/posts\/(\d+)/);
		if (m) {
			const j = await getJson(`https://fantia.jp/api/v1/posts/${m[1]}`, landingUrl);
			summary.sensitive = j.post?.rating === 'adult';
		}
		return summary;
	}

	return summary;
}

async function getJson(url: string, referer: string) {
	const json = await fetch(url, {
		timeout: 10 * 1000,
		size: 10 * 1024 * 1024,
		agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent,
		headers: {
			'User-Agent': browserUA,
			'Referer': referer
		}
	}).then(res => {
		if (!res.ok) {
			throw `${res.status} ${res.statusText}`;
		} else {
			return res.json();
		}
	});

	return json;
}
