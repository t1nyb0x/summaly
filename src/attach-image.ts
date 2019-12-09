import * as tmp from 'tmp';
import * as fs from 'fs';
import * as request from 'request';
import * as URL from 'url';
import Summary from './summary';
import fileType = require('file-type');
import isSvg from 'is-svg';
import { ConvertToJpeg } from './utils/image-processor';

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

async function detectMine(path: string) {
	return new Promise<[string, string]>((res, rej) => {
		const readable = fs.createReadStream(path);
		readable
			.on('error', rej)
			.once('data', (buffer: Buffer) => {
				readable.destroy();
				const type = fileType(buffer);
				if (type) {
					if (type.mime == 'application/xml' && checkSvg(path)) {
						res(['image/svg+xml', 'svg']);
					} else {
						res([type.mime, type.ext]);
					}
				} else if (checkSvg(path)) {
					res(['image/svg+xml', 'svg']);
				} else {
					// 種類が同定できなかったら application/octet-stream にする
					res(['application/octet-stream', null]);
				}
			})
			.on('end', () => {
				// maybe 0 bytes
				res(['application/octet-stream', null]);
			});
	});
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
