import summaly from '../';
import loadConfig from './load-config';
import * as Fastify from 'fastify';
import cors from 'fastify-cors';

const config = loadConfig();

const server = Fastify.fastify({
	logger: true,
	exposeHeadRoutes: true,
});

server.register(cors);

function validateUrl(url: string) {
	const u = new URL(url);
	if (u.port !== '' && u.port !== '80' && u.port !== '443') {
		throw `invalid port ${u.port}`;
	}
}

server.get<{
		Querystring: {
			url?: string;
			lang?: string;
		},
	}>('/url', async (request, reply) => {
		if (!request.query.url) {
			reply.code(400).send('no url');
			return;
		}

		try {
			validateUrl(request.query.url);

			const summary = await summaly(request.query.url, {
				lang: request.query.lang,
				followRedirects: false,
				attachImage: typeof config.attachImage === 'boolean' ? config.attachImage : true,
				allowedPlugins: config.allowedPlugins || [],
			});

			reply
				.header('Cache-Control', 'public, max-age=604800')
				.send(summary);
		} catch (e) {
			console.log(`summaly error: ${e} ${request.query.url}`);
			reply
				.code(500)
				.header('Cache-Control', 'public, max-age=3600')
				.send('error');
		}
});

const port = process.env.PORT || 3030;

server.listen(port, '0.0.0.0', (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
