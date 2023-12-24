/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node/http" />
/// <reference types="got/dist/source/core/utils/timed-out" />
import * as http from 'http';
import * as https from 'https';
export declare const httpAgent: http.Agent;
export declare const httpsAgent: https.Agent;
export declare const agent: {
    http: http.Agent;
    https: https.Agent;
};
