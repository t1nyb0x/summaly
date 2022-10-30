import summaly from '../';
import loadConfig from './load-config';
import * as h3 from 'h3';
import { createServer } from 'http';
import { Type, validateQuery } from 'h3-typebox';
import { StatusError } from '../utils/status-error';

const config = loadConfig();

function validateUrl(url: string) {
	const u = new URL(url);
	if (u.port !== '' && u.port !== '80' && u.port !== '443') {
		throw `invalid port ${u.port}`;
	}
}

const app = h3.createApp();
const router = h3.createRouter();

const validater = Type.Object({
	url: Type.String(),
	lang: Type.Optional(Type.String()),
});

router.get('/url', h3.eventHandler(async event => {
	const query = validateQuery(event, validater);

	try {
		validateUrl(query.url);

		const summary = await summaly(query.url, {
			lang: query.lang,
			followRedirects: false,
			attachImage: typeof config.attachImage === 'boolean' ? config.attachImage : true,
			allowedPlugins: config.allowedPlugins || [],
		});

		h3.setResponseHeader(event, 'Cache-Control', 'public, max-age=604800');
		return summary;
	} catch (e) {
		console.log(`summaly error: ${e} ${query.url}`);
		if (e instanceof StatusError && e.isPermanentError) {
			event.res.statusCode = 400;
		} else {
			event.res.statusCode = 500;
		}
		h3.setResponseHeader(event, 'Content-Type', 'text/plain');
		h3.setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');
		return 'error';
	}
}));

app.use(router);

const server = createServer(h3.toNodeListener(app));

server.on('error', err => {
	console.error(err);
	process.exit(1);
});

server.listen(process.env.PORT || 3030);
