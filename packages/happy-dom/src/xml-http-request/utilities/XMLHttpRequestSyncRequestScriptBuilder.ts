import HTTPS from 'https';

/**
 * Synchroneous XMLHttpRequest script builder.
 */
export default class XMLHttpRequestSyncRequestScriptBuilder {
	/**
	 * Sends a synchronous request.
	 *
	 * @param options Options.
	 * @param ssl SSL.
	 * @param data Data.
	 */
	public static getScript(options: HTTPS.RequestOptions, ssl: boolean, data?: string): string {
		// Synchronous
		// Note: console.log === stdout
		// The async request the other Node process executes
		return `
                const HTTP = require('http');
                const HTTPS = require('https');
                const sendRequest = HTTP${ssl ? 'S' : ''}.request;
                const options = ${JSON.stringify(options)};
                const request = sendRequest(options, (response) => {
                    let responseText = '';
                    let responseData = Buffer.alloc(0);
                    response.on('data', (chunk) => {
                        responseText += chunk;
                        responseData = Buffer.concat([responseData, Buffer.from(chunk)]);
                    });
                    response.on('end', () => {
                        console.log(JSON.stringify({
                            error: null,
                            data: {
                                statusCode: response.statusCode,
                                statusMessage: response.statusMessage,
                                headers: response.headers,
                                text: responseText,
                                data: responseData.toString('base64')
                            }
                        }));
                    });
                    response.on('error', (error) => {
                        console.log(JSON.stringify({ error: error.toString(), data: null }));
                    });
                });
                request.write(\`${JSON.stringify(data ?? '')
									.slice(1, -1)
									.replace(/'/g, "\\'")}\`);
                request.end();
            `;
	}
}
