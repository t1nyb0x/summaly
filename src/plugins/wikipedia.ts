import { fetchApi } from '../utils/fetch-api';
import * as debug from 'debug';
import summary from '../summary';
import { decodeEntities } from '../utils/decode-entities';

const log = debug('summaly:plugins:wikipedia');

export function test(url: URL): boolean {
	return /\.wikipedia\.org$/.test(url.hostname);
}

export async function summarize(url: URL): Promise<summary> {
	const lang = url.host.split('.')[0];
	const title = url.pathname.split('/')[2];
	const endpoint = `https://${lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}`;

	log(`lang is ${lang}`);
	log(`title is ${title}`);
	log(`endpoint is ${endpoint}`);

	const body = await fetchApi(endpoint);

	log(body);

	if (!('query' in body) || !('pages' in body.query)) {
		throw 'fetch failed';
	}

	const info = body.query.pages[Object.keys(body.query.pages)[0]];

	return {
		title: info.title,
		icon: 'https://wikipedia.org/static/favicon/wikipedia.ico',
		description: decodeEntities(info.extract, 300),
		thumbnail: `https://wikipedia.org/static/images/project-logos/${lang}wiki.png`,
		player: {
			url: null,
			width: null,
			height: null
		},
		sitename: 'Wikipedia'
	};
}
