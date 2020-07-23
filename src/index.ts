/**
 * summaly
 * https://github.com/syuilo/summaly
 */

import requireAll = require('require-all');
import tracer from 'trace-redirect';
import Summary from './summary';
import IPlugin from './iplugin';
import general from './general';
import { attachImage } from './attach-image';

// Load builtin plugins
const _builtinPlugins = requireAll({
	dirname: __dirname + '/plugins'
}) as { [key: string]: IPlugin };

type Options = {
	/**
	 * Accept-Language for the request
	 */
	lang?: string;

	/**
	 * Whether follow redirects
	 */
	followRedirects?: boolean;

	attachImage?: boolean;

	/**
	 * Custom Plugins
	 */
	plugins?: IPlugin[];

	allowedPlugins?: string[],
};

const defaultOptions = {
	lang: null,
	followRedirects: true,
	attachImage: true,
	plugins: null
} as Options;

/**
 * Summarize an web page
 */
export default async (url: string, options?: Options): Promise<Summary> => {
	const opts = Object.assign(defaultOptions, options);

	const builtinPlugins = Object.keys(_builtinPlugins)
		.filter(key => opts.allowedPlugins == null || opts.allowedPlugins.includes(key))
		.map(key => _builtinPlugins[key]);

	const plugins = builtinPlugins.concat(opts.plugins || []);

	const actualUrl = opts.followRedirects ? await tracer(url).catch(() => url) : url;

	const _url = new URL(actualUrl);

	// Find matching plugin
	const match = plugins.filter(plugin => plugin.test(_url))[0];

	// Get summary
	const summary = await (match ? match.summarize : general)(_url, opts.lang);

	if (summary == null) {
		throw 'failed summarize';
	}

	if (opts.attachImage) await attachImage(summary);

	if (summary.url == null) summary.url = actualUrl;

	return summary;
};
