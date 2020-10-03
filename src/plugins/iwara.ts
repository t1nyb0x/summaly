// Iwara 補完プラグイン
// https://github.com/shikorism/tissue/blob/54e112fa577315718893c803d16223f9a9a66a01/app/MetadataResolver/IwaraResolver.php を参考にした
import { SummalyEx } from '../summaly';
import general from '../general';
import { decodeEntities } from '../utils/decode-entities';

export function test(url: URL): boolean {
	return /^(?:www|ecchi)[.]iwara[.]tv$/.test(url.hostname);
}

export async function postProcess(summaly: SummalyEx): Promise<SummalyEx> {
	const landingUrl = summaly.url;

	//#region description
	if (summaly.description == null && summaly.$) {
		let description = summaly.$('.field-type-text-with-summary').text() || null;
		description = decodeEntities(description, 500);

		if (description !== summaly.title) {
			summaly.description = description;
		}
	}
	//#endregion description

	//#region thumbnail
	if (summaly.thumbnail == null && summaly.$) {
		const thum =
			summaly.$('#video-player').first().attr('poster') ||
			summaly.$('.field-name-field-images a').first().attr('href') ||
			null;

		const thumbnail = thum ? new URL(thum, landingUrl).href : null;

		summaly.thumbnail = thumbnail;
	}
	//#endregion thumbnail

	if (landingUrl.match(/[/][/]ecchi[.]/)) summaly.sensitive = true;

	return summaly;
}
