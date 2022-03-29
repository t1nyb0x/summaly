import * as sharp from 'sharp';

export type IImage = {
	data: Buffer;
	ext: string;
	type: string;
};

/**
 * Convert to JPEG
 *   with resize, remove metadata, resolve orientation, stop animation
 */
export async function ConvertToJpeg(path: string, width: number, height: number): Promise<IImage> {
	const data = await sharp(path)
		.resize(width, height, {
			fit: 'inside',
			withoutEnlargement: true
		})
		.rotate()
		.jpeg({
			quality: 85,
			progressive: true,
			mozjpeg: true,
		})
		.toBuffer();

	return {
		data,
		ext: 'jpg',
		type: 'image/jpeg'
	};
}
