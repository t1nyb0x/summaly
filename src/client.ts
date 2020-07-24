import { version } from '../package.json';
import * as client from 'cheerio-httpcli';

client.set('headers', {
	'User-Agent': `SummalyBot/${version}`
});
client.set('referer', false);
client.set('timeout', 20000);
client.set('maxDataSize', 10 * 1024 * 1024);

export function createInstance() {
	return client.fork();
}

export const browserUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36';
