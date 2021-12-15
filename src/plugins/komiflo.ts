// Komiflo 画像補完プラグイン
// https://github.com/shikorism/tissue/blob/54e112fa577315718893c803d16223f9a9a66a01/app/MetadataResolver/KomifloResolver.php を参考にした
import { SummalyEx } from '../summaly';
import { getJson } from '../utils/got';

export function test(url: URL): boolean {
	return /^komiflo[.]com$/.test(url.hostname);
}

export async function postProcess(summaly: SummalyEx): Promise<SummalyEx> {
	const landingUrl = summaly.url;

	// 作品ページ？
	const m = landingUrl.match(/komiflo[.]com(?:[/]#!)?[/]comics[/](\d+)/);

	if (m) {
		// 取得出来ていればそのまま
		if (!summaly.thumbnail?.match(/favicon|ogp_logo/)) return summaly;

		const id = m[1];
		const apiUrl = `https://api.komiflo.com/content/id/${id}`;

		try {
			const json = (await getJson(apiUrl, landingUrl)) as {
				content?: Content;
			};

			const named_imgs = json?.content?.named_imgs || json?.content?.children?.[0]?.named_imgs;

			if (named_imgs?.cover?.filename && named_imgs?.cover?.variants?.includes('346_mobile')) {
				const thumbnail = 'https://t.komiflo.com/346_mobile/' + named_imgs.cover.filename;
				summaly.thumbnail = thumbnail;
				summaly.sensitive = true;
			}

		} catch (e) {
			console.log(`Error in komiflo ${e}`);
		}
	}

	return summaly;
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
