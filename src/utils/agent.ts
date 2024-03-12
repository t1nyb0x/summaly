import * as http from 'http';
import * as https from 'https';
import { env } from 'process';

const family = env.SUMMALY_FAMILY == '4' ? 4 : env.SUMMALY_FAMILY == '6' ? 6 : undefined;

export const httpAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
	family,
} as http.AgentOptions);

export const httpsAgent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
	family,
} as https.AgentOptions);

export const agent = {
	http: httpAgent,
	https: httpsAgent,
};
