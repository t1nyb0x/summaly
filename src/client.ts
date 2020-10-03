import * as client from 'cheerio-httpcli';

client.set('headers', {
	'User-Agent': `Twitterbot/1.0`
});
client.set('referer', false);
client.set('timeout', 20000);
client.set('maxDataSize', 10 * 1024 * 1024);

export function createInstance() {
	return client.fork();
}

export const browserUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36';
