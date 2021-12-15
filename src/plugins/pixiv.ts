// Pixiv R-18 画像補完プラグイン
// HUGE THANKS TO TISSUE AND PIXIV.CAT!
// tissue: https://github.com/shikorism/tissue/blob/134a11ad512e50afe72f4286048dd239da58bfcd/app/MetadataResolver/PixivResolver.php
import { getJson } from '../utils/got';
import { SummalyEx } from '../summaly';

export function test(url: URL): boolean {
	return /^www\.pixiv\.net$/.test(url.hostname);
}

export async function postProcess(summaly: SummalyEx): Promise<SummalyEx> {
	// 画像が取得できていればそのまま
	if (!summaly.thumbnail?.match(/pixiv_logo/)) return summaly;

	const landingUrl = summaly.url;

	const m = landingUrl.match(/www\.pixiv\.net\/(?:en\/)?artworks\/(\d+)/);
	if (!m) return summaly;

	const illustId = m[1];

	const apiUrl = `https://www.pixiv.net/ajax/illust/${illustId}`;

	const json = await getJson(apiUrl, landingUrl);

	const thum = json.body?.urls?.thumb || json.body?.urls?.small || json.body?.urls?.regular;

	if (typeof thum === 'string') {
		const thum2 = thum.replace('i.pximg.net', 'i.pixiv.cat');
		summaly.thumbnail = thum2;
		summaly.sensitive = true;
	}

	return summaly;
}
