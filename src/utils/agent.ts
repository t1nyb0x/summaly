import * as http from 'http';
import * as https from 'https';

export const httpAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
} as http.AgentOptions);

export const httpsAgent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
} as https.AgentOptions);

export const agent = {
	http: httpAgent,
	https: httpsAgent,
};
