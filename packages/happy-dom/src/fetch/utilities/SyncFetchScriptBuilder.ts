import FetchHTTPSCertificate from '../certificate/FetchHTTPSCertificate.js';

/**
 * Synchronous fetch script builder.
 */
export default class SyncFetchScriptBuilder {
	/**
	 * Sends a synchronous request.
	 *
	 * @param request Request.
	 * @returns Script.
	 */
	public static getScript(request: {
		url: URL;
		method: string;
		headers: { [name: string]: string };
		body?: Buffer | null;
	}): string {
		// Synchronous
		// Note: console.log === stdout
		// The async request the other Node process executes
		return `
                const sendRequest = require('http${
									request.url.protocol === 'https:' ? 's' : ''
								}').request;
                const options = ${JSON.stringify({
									method: request.method,
									headers: request.headers,
									agent: false,
									rejectUnauthorized: true,
									key: request.url.protocol === 'https:' ? FetchHTTPSCertificate.key : undefined,
									cert: request.url.protocol === 'https:' ? FetchHTTPSCertificate.cert : undefined
								})};
                const request = sendRequest(${request.url.href}, options, (incomingMessage) => {
                    let data = Buffer.alloc(0);
                    incomingMessage.on('data', (chunk) => {
                        data = Buffer.concat([data, Buffer.from(chunk)]);
                    });
                    incomingMessage.on('end', () => {
                        console.log(JSON.stringify({
                            error: null,
                            incomingMessage: {
                                statusCode: incomingMessage.statusCode,
                                statusMessage: incomingMessage.statusMessage,
                                rawHeaders: incomingMessage.rawHeaders,
                                data: data.toString('base64')
                            }
                        }));
                    });
                    incomingMessage.on('error', (error) => {
                        console.log(JSON.stringify({ error: error.message, incomingMessage: null }));
                    });
                });
                request.write(Buffer.from('${
									request.body ? request.body.toString('base64') : ''
								}', 'base64'));
                request.end();
            `;
	}
}
