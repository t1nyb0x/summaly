// Iwara 補完プラグイン
// https://github.com/shikorism/tissue/blob/54e112fa577315718893c803d16223f9a9a66a01/app/MetadataResolver/IwaraResolver.php を参考にした
import summary from '../summary';
import general from '../general';
import { decodeEntities } from '../utils/decode-entities';

export function test(url: URL): boolean {
	return /^(?:www|ecchi)[.]iwara[.]tv$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<summary> {
	const s = await general(url, null, true);	// info付き

	const landingUrl = s.url || url.href;

	//#region description
	if (s.description == null && s.$) {
		let description = s.$('.field-type-text-with-summary').text() || null;
		description = decodeEntities(description, 500);

		if (description !== s.title) {
			s.description = description;
		}
	}
	//#endregion description

	//#region thumbnail
	if (s.thumbnail == null && s.$) {
		const thum =
			s.$('#video-player').first().attr('poster') || 
			s.$('.field-name-field-images a').first().attr('href') ||
			null;

		const thumbnail = thum ? new URL(thum, landingUrl).href : null;

		s.thumbnail = thumbnail;
	}
	//#endregion thumbnail

	if (landingUrl.match(/[/][/]ecchi[.]/)) s.sensitive = true;

	delete s.$;	// info削除

	return s;
}
