import * as http from 'http';
import * as https from 'https';
import CacheableLookup from 'cacheable-lookup';

const cache = new CacheableLookup({
	maxTtl: 3600,	// 1hours
	errorTtl: 30,	// 30seconds
	lookup: false,	// Don't fall back to native dns.lookup
});

export const httpAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
	lookup: cache.lookup,
} as http.AgentOptions);

export const httpsAgent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
	lookup: cache.lookup,
} as https.AgentOptions);

export const agent = {
	http: httpAgent,
	https: httpsAgent,
};
