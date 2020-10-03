// Pixiv R-18 画像補完プラグイン
// HUGE THANKS TO TISSUE AND PIXIV.CAT!
// tissue: https://github.com/shikorism/tissue/blob/134a11ad512e50afe72f4286048dd239da58bfcd/app/MetadataResolver/PixivResolver.php
import { fetchApi } from '../utils/fetch-api';
import { Summaly } from '../summaly';
import general from '../general';

export function test(url: URL): boolean {
	return /^www\.pixiv\.net$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<Summaly> {
	const s = await general(url);

	// 画像が取得できていればそのまま
	if (!s.thumbnail?.match(/pixiv_logo/)) return s;

	const landingUrl = s.url || url.href;

	const m = landingUrl.match(/www\.pixiv\.net\/(?:en\/)?artworks\/(\d+)/);
	if (!m) return s;

	const illustId = m[1];

	const apiUrl = `https://www.pixiv.net/ajax/illust/${illustId}`;

	const json = await fetchApi(apiUrl, landingUrl);

	const thum = json.body?.urls?.thumb || json.body?.urls?.small || json.body?.urls?.regular;

	if (typeof thum === 'string') {
		const thum2 = thum.replace('i.pximg.net', 'i.pixiv.cat');
		s.thumbnail = thum2;
		s.sensitive = true;
	}

	return s;
}
