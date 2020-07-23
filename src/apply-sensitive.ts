import fetch from 'node-fetch';
import Summary from './summary';
import { httpAgent, httpsAgent } from './utils/agent';

export async function applySensitive(summary: Summary): Promise<Summary> {
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
		agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
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
