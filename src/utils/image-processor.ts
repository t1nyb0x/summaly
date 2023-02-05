import * as sharp from 'sharp';

export type IImage = {
	data: Buffer;
	ext: string;
	type: string;
};

export async function ConvertToWebp(path: string, width: number, height: number): Promise<IImage> {
	const data = await sharp(path)
		.resize(width, height, {
			fit: 'inside',
			withoutEnlargement: true
		})
		.rotate()
		.webp({
			quality: 85,
		})
		.toBuffer();

	return {
		data,
		ext: 'webp',
		type: 'image/webp'
	};
}
