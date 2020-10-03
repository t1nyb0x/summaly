// ニジエ 画像補完プラグイン
// https://github.com/shikorism/tissue/blob/d69fe6a22a23eb685c4e04db84bb03f2c57311a1/app/MetadataResolver/NijieResolver.php を参考にした
import { SummalyEx } from '../summaly';
import general from '../general';

export function test(url: URL): boolean {
	return /^nijie[.]info$/.test(url.hostname);
}

type ImageObject = {
	"@context"?: string;
	"@type": "ImageObject";
	"name"?: string;
	"description"?: string;
	"text"?: string;
	"interactionCount"?: string;
	"datePublished"?: string;
	"uploadDate"?: string;
	"dateModified"?: string;
	"copyrightYear"?: string;
	"genre"?: string;
	"contentLocation"?: string;
	"width"?: Number;
	"height"?: Number;
	"thumbnailUrl"?: string;
	"author"?: Person;
	"creator"?: Person;
	"editor"?: Person;
	"copyrightHolder"?: Person;
};

type Person = {
	"@context"?: string;
	"@type": "Person",
	"name"?: string;
	"description"?: string;
	"sameAs"?: string;
	"image"?: string;
};

export const isImageObject = (object: any): object is ImageObject =>
	object['@type'] === 'ImageObject';

export async function postProcess(summaly: SummalyEx): Promise<SummalyEx> {
	const landingUrl = summaly.url;

	const m = landingUrl.match(/nijie[.]info[/]view[.]php/);

	if (m && summaly.$) {
		try {
			const $ = summaly.$;

			const lds = [] as ImageObject[];
			const ele = $('script[type="application/ld+json"]');
			ele.each(function() {
				// 改行がそのまま入っていることがあるのでデコード前にエスケープが必要
				const text = $(this).text().replace(/\r?\n/g, '\\n');
				lds.push(JSON.parse(text));
			});

			const io = lds.filter(isImageObject)[0];

			if (io?.thumbnailUrl) {
				summaly.thumbnail = io.thumbnailUrl;
				summaly.sensitive = true;
			}
		} catch (e) {
			console.log(`Error in nijie ${e}`);
		}
	}

	return summaly;
}
