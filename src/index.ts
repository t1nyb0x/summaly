/**
 * summaly
 * https://github.com/syuilo/summaly
 */

import { StripEx, Summaly } from './summaly';
import IPlugin from './iplugin';
import general from './general';
import { sanitizeUrl } from './utils/sanitize-url';
import { resolve } from 'path';

type Options = {
	/**
	 * Accept-Language for the request
	 */
	lang?: string | null;

	/**
	 * Whether follow redirects
	 */
	followRedirects?: boolean;

	/**
	 * Custom Plugins
	 */
	plugins?: IPlugin[] | null;

	allowedPlugins?: string[],
};

const defaultOptions = {
	lang: null,
	followRedirects: true,
	plugins: null
} as Options;

/**
 * Summarize an web page
 */
export default async (url: string, options?: Options): Promise<Summaly> => {
	const opts = Object.assign(defaultOptions, options);

	const plugins = [] as IPlugin[];

	for (const key of opts.allowedPlugins || []) {
		try {
			const p = require(resolve(__dirname, 'plugins', key));
			plugins.push(p);
			console.log(`Plugin loaded ${key}`);
		} catch (e) {
			console.warn(`Plugin load failed ${key}`);
		}
	}

	const _url = new URL(url);

	// pre
	const preMatch = plugins.filter(plugin => plugin.test(_url))[0];

	if (preMatch && preMatch.process) {
		const summary = await preMatch.process(_url);
		if (summary == null) throw 'failed summarize';

		if (summary.player) summary.player.url = sanitizeUrl(summary.player.url);
		summary.icon = sanitizeUrl(summary.icon);
		summary.thumbnail = sanitizeUrl(summary.thumbnail);

		return summary;
	} else {
		let summary = await general(_url, opts.lang);
		if (summary == null) throw 'failed summarize';
		const landingUrl = summary.url;
		const match = plugins.filter(plugin => plugin.test(new URL(landingUrl)))[0];
		if (match && match.postProcess) {
			summary = await match.postProcess(summary);
		}

		if (summary.player) summary.player.url = sanitizeUrl(summary.player.url);
		summary.icon = sanitizeUrl(summary.icon);
		summary.thumbnail = sanitizeUrl(summary.thumbnail);

		return StripEx(summary);
	}
};
