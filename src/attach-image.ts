import * as tmp from 'tmp';
import * as fs from 'fs';
import { Summaly } from './summaly';
import { ConvertToWebp } from './utils/image-processor';
import { fetchUrl } from './utils/got';

const probeImageSize = require('probe-image-size');

export async function attachImage(summary: Summaly) {
	summary.thumbnail = await convertUrl(summary.thumbnail);
	summary.icon = await convertUrl(summary.icon, 32, 32);
}

async function convertUrl(url: string | null | undefined, width = 128, heigth = 128) {
	if (url == null) return null;

	const u = new URL(url);
	if (!u.protocol.match(/^https?:$/) || u.hostname === 'unix') {
		return null;
	}

	const [path, cleanup] = await new Promise<[string, any]>((res, rej) => {
		tmp.file((e, path, fd, cleanup) => {
			if (e) return rej(e);
			res([path, cleanup]);
		});
	});

	try {
		await fetchUrl(url, path);

		const type = await detectMine(path);

		if (type && ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'].includes(type)) {
			const image = await ConvertToWebp(path, width, heigth);
			return `data:image/webp;base64,${image.data.toString('base64')}`;
		}

		return url;
	} catch (e) {
		return url;
	} finally {
		cleanup();
	}
}

export async function detectMine(path: string) {
	const imageSize = await detectImageSize(path).catch(() => null);

	// うまく判定できない画像は octet-stream にする
	if (!imageSize) return 'application/octet-stream';

	// 制限を超えている画像は octet-stream にする
	if (imageSize.wUnits === 'px' && (imageSize.width > 16383 || imageSize.height > 16383)) return 'application/octet-stream';

	return imageSize.mime;
}

async function detectImageSize(path: string) {
	const readable = fs.createReadStream(path);
	const imageSize = await probeImageSize(readable) as {
		width: number;
		height: number;
		wUnits: string;
		hUnits: string;
		mime: string;
	};
	readable.destroy();

	return imageSize;
}
