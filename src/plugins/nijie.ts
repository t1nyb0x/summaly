// ニジエ 画像補完プラグイン
// https://github.com/shikorism/tissue/blob/d69fe6a22a23eb685c4e04db84bb03f2c57311a1/app/MetadataResolver/NijieResolver.php を参考にした
import summary from '../summary';
import general from '../general';

export function test(url: URL): boolean {
	return /^nijie[.]info$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<summary> {
	const s = await general(url, null, true);	// info付き

	const landingUrl = s.url || url.href;

	const m = landingUrl.match(/nijie[.]info[/]view[.]php/);

	if (m && s.$) {
		try {
			const $ = s.$;

			const lds = [];
			const ele = $('script[type="application/ld+json"]');
			ele.each(function() {
				// 改行がそのまま入っていることがあるのでデコード前にエスケープが必要
				const text = $(this).text().replace(/\r?\n/g, '\\n');
				lds.push(JSON.parse(text));
			});

			const io = lds.filter(isImageObject)[0];

			if (io?.thumbnailUrl) {
				s.thumbnail = io.thumbnailUrl;
				s.sensitive = true;
			}
		} catch (e) {
			console.log(`Error in nijie ${e}`);
		}
	}

	delete s.$;	// info削除
	return s;
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

export const isImageObject= (object: any): object is ImageObject =>
	object['@type'] === 'ImageObject';
