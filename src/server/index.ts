import * as http from 'http';
import * as Koa from 'koa';
import summaly from '../';

const app = new Koa();

app.use(async ctx => {
	if (!ctx.query.url) {
		ctx.status = 400;
		return;
	}

	try {
		const summary = await summaly(ctx.query.url, {
			lang: ctx.query.lang,
			followRedirects: false
		});

		ctx.body = summary;
		ctx.set('Cache-Control', 'public, max-age=3600');
	} catch (e) {
		if (e.statusCode >= 400 && e.statusCode < 500) {
			ctx.status = e.statusCode;
			ctx.set('Cache-Control', 'public, max-age=3600');
		} else {
			console.log(`summaly error: ${e} ${ctx.query.url}`);
			ctx.status = 500;
			ctx.set('Cache-Control', 'public, max-age=300');
		}
	}
});

const server = http.createServer(app.callback());

server.listen(process.env.PORT || 3030);
