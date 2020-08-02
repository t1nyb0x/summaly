// Komiflo 画像補完プラグイン
// https://github.com/shikorism/tissue/blob/54e112fa577315718893c803d16223f9a9a66a01/app/MetadataResolver/KomifloResolver.php を参考にした
import summary from '../summary';
import general from '../general';
import fetch from 'node-fetch';
import { httpAgent, httpsAgent } from '../utils/agent';
import { browserUA } from '../client';

export function test(url: URL): boolean {
	return /^komiflo[.]com$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<summary> {
	const s = await general(url);	// info付き

	const landingUrl = s.url || url.href;

	// 作品ページ？
	const m = landingUrl.match(/komiflo[.]com(?:[/]#!)?[/]comics[/](\d+)/);

	if (m) {
		// 取得出来ていればそのまま
		if (!s.thumbnail?.match(/favicon|ogp_logo/)) return s;

		const id = m[1];
		const apiUrl = `https://api.komiflo.com/content/id/${id}`;

		try {
			const json = await fetch(apiUrl, {
				timeout: 10 * 1000,
				agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent,
				headers: {
					'User-Agent': browserUA,
					'Referer': landingUrl
				}
			}).then(res => {
				if (!res.ok) {
					throw `${res.status} ${res.statusText}`;
				} else {
					return res.json();
				}
			}) as {
				content?: Content;
			};

			const named_imgs = json?.content?.named_imgs || json?.content?.children?.[0]?.named_imgs;

			if (named_imgs?.cover?.filename && named_imgs?.cover?.variants?.includes('346_mobile')) {
				const thumbnail = 'https://t.komiflo.com/346_mobile/' + named_imgs.cover.filename;
				s.thumbnail = thumbnail;
				s.sensitive = true;
			}

		} catch (e) {
			console.log(`Error in komiflo ${e}`);
		}
	}

	return s;
}

type Content = {
	children?: Content;
	named_imgs?: {
		cover?: {
			filename?: string;
			variants?: string[];
		};
	};
};
