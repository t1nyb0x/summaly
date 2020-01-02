import * as tmp from 'tmp';
import * as fs from 'fs';
import * as request from 'request';
import * as URL from 'url';
import Summary from './summary';
import fileType = require('file-type');
import isSvg from 'is-svg';
import { ConvertToJpeg } from './utils/image-processor';
const probeImageSize = require('probe-image-size');

export async function attachImage(summary: Summary) {
	summary.thumbnail = await convertUrl(summary.thumbnail);
	summary.icon = await convertUrl(summary.icon);
}

async function convertUrl(url: string) {
	if (url == null) return url;
	if (!url.match(/^https?:/)) return url;

	const [path, cleanup] = await new Promise<[string, any]>((res, rej) => {
		tmp.file((e, path, fd, cleanup) => {
			if (e) return rej(e);
			res([path, cleanup]);
		});
	});

	try {
		await fetch(url, path);

		const [type] = await detectMine(path);

		if (['image/jpeg', 'image/png', 'image/gif'].includes(type)) {
			const image = await ConvertToJpeg(path, 200, 200);
			return `data:image/jpeg;base64,${image.data.toString('base64')}`;
		} else {
			return `data:${type};base64,${fs.readFileSync(path).toString('base64')}`;
		}
	} catch (e) {
		return url;
	} finally {
		cleanup();
	}
}

async function fetch(url: string, path: string) {
	await new Promise((res, rej) => {
		const writable = fs.createWriteStream(path);

		writable.on('finish', () => {
			res();
		});

		writable.on('error', error => {
			rej(error);
		});

		const requestUrl = URL.parse(url).pathname.match(/[^\u0021-\u00ff]/) ? encodeURI(url) : url;

		const req = request({
			url: requestUrl,
			timeout: 10 * 1000,
		});

		req.pipe(writable);

		req.on('response', response => {
			if (response.statusCode !== 200) {
				writable.close();
				rej(response.statusCode);
			}
		});

		req.on('error', error => {
			writable.close();
			rej(error);
		});
	});
}

export async function detectMine(path: string) {
	let type = await detectType(path);

	if (type.mime.startsWith('image/')) {
		const imageSize = await detectImageSize(path).catch(() => null);

		// うまく判定できない画像は octet-stream にする
		if (!imageSize) {
			type = {
				mime: 'application/octet-stream',
				ext: null
			};
		}

		// 制限を超えている画像は octet-stream にする
		if (imageSize.wUnits === 'px' && (imageSize.width > 16383 || imageSize.height > 16383)) {
			type = {
				mime: 'application/octet-stream',
				ext: null
			};
		}
	}

	return [type.mime, type.ext];
}

async function detectType(path: string) {
	// Check 0 byte
	const fileSize = await detectFileSize(path);
	if (fileSize === 0) {
		return {
			mime: 'application/octet-stream',
			ext: null
		};
	}

	const readable = fs.createReadStream(path);
	const type = (await fileType.stream(readable)).fileType;
	readable.destroy();

	if (type) {
		// XMLはSVGかもしれない
		if (type.mime === 'application/xml' && checkSvg(path)) {
			return {
				mime: 'image/svg+xml',
				ext: 'svg'
			};
		}

		return {
			mime: type.mime,
			ext: type.ext
		};
	}

	// 種類が不明でもSVGかもしれない
	if (checkSvg(path)) {
		return {
			mime: 'image/svg+xml',
			ext: 'svg'
		};
	}

	// それでも種類が不明なら application/octet-stream にする
	return {
		mime: 'application/octet-stream',
		ext: null
	};
}

async function detectFileSize(path: string) {
	return new Promise<number>((res, rej) => {
		fs.stat(path, (err, stats) => {
			if (err) return rej(err);
			res(stats.size);
		});
	});
}

async function detectImageSize(path: string) {
	const readable = fs.createReadStream(path);
	const imageSize = await probeImageSize(readable) as {
		width: number;
		height: number;
		wUnits: string;
		hUnits: string;
	};
	readable.destroy();

	return imageSize;
}

function checkSvg(path: string) {
	try {
		const size = fs.statSync(path).size;
		if (size > 1 * 1024 * 1024) return false;
		return isSvg(fs.readFileSync(path));
	} catch {
		return false;
	}
}
