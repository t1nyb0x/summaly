import fetch from 'node-fetch';
import { httpAgent, httpsAgent } from '../utils/agent';
import summary from '../summary';
import general from '../general';

// HUGE THANKS TO TISSUE AND PIXIV.CAT!
// tissue: https://github.com/shikorism/tissue/blob/134a11ad512e50afe72f4286048dd239da58bfcd/app/MetadataResolver/PixivResolver.php

export function test(url: URL): boolean {
	return /^www\.pixiv\.net$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<summary> {
	const s = await general(url);

	// 画像が取得できていればそのまま
	if (!s.thumbnail?.match(/pixiv_logo/)) return s;

	const landingUrl = s.url || url.href;

	const m = landingUrl.match(/www\.pixiv\.net\/(?:en\/)?artworks\/(\d+)/);
	if (!m) return s;

	const illustId = m[1];

	const apiUrl = `https://www.pixiv.net/ajax/illust/${illustId}`;

	const json = await fetch(apiUrl, {
		timeout: 10 * 1000,
		agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
			'Referer': landingUrl
		}
	}).then(res => {
		if (!res.ok) {
			throw `${res.status} ${res.statusText}`;
		} else {
			return res.json();
		}
	});

	const thum = json.body?.urls?.thumb || json.body?.urls?.small || json.body?.urls?.regular;

	if (typeof thum === 'string') {
		const thum2 = thum.replace('i.pximg.net', 'i.pixiv.cat');
		s.thumbnail = thum2;
		s.sensitive = true;
	}

	return s;
}
