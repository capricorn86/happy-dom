import IRequestInit from '../fetch/types/IRequestInit.js';
import IRequestInfo from '../fetch/types/IRequestInfo.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import URL from '../url/URL.js';
import Request from '../fetch/Request.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import ChildProcess from 'child_process';
import ISyncResponse from './ISyncResponse.js';
import Headers from '../fetch/Headers.js';
import CachedResponseStateEnum from '../cache/response/CachedResponseStateEnum.js';

/**
 * Handles synchrounous fetch requests.
 */
export default class SyncFetch {
	private request: Request;
	private disableCache: boolean;
	private disableCrossOriginPolicy: boolean;
	#browserFrame: IBrowserFrame;
	#window: IBrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.browserFrame Browser frame.
	 * @param options.window Window.
	 * @param options.url URL.
	 * @param [options.init] Init.
	 * @param [options.redirectCount] Redirect count.
	 * @param [options.contentType] Content Type.
	 * @param [options.disableCache] Disables the use of cached responses. It will still store the response in the cache.
	 */
	constructor(options: {
		browserFrame: IBrowserFrame;
		window: IBrowserWindow;
		url: IRequestInfo;
		init?: IRequestInit;
		contentType?: string;
		disableCache?: boolean;
		disableCrossOriginPolicy?: boolean;
	}) {
		this.#browserFrame = options.browserFrame;
		this.#window = options.window;
		this.request =
			typeof options.url === 'string' || options.url instanceof URL
				? new options.browserFrame.window.Request(options.url, options.init)
				: <Request>options.url;
		if (options.contentType) {
			(<string>this.request.__contentType__) = options.contentType;
		}
		this.disableCache = options.disableCache ?? false;
		this.disableCrossOriginPolicy = options.disableCrossOriginPolicy ?? false;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	public send(): ISyncResponse {
		// Start the other Node Process, executing this string
		const content = ChildProcess.execFileSync(process.argv[0], ['-e', this.getScript()], {
			encoding: 'buffer',
			maxBuffer: 1024 * 1024 * 1024 // TODO: Consistent buffer size: 1GB.
		});

		// If content length is 0, then there was an error
		if (!content.length) {
			throw new DOMException('Synchronous request failed', DOMExceptionNameEnum.networkError);
		}

		const { error, response } = JSON.parse(content.toString());

		if (error) {
			throw new Error(error);
		}

		const body = Buffer.from(response.body, 'base64');
		const headers = new Headers();

		for (const [key, value] of Object.entries(response.headers)) {
			headers.set(key, <string>value);
		}

		if (!this.disableCache) {
			this.#browserFrame.page.context.responseCache.add(this.request, {
				status: <number>response.status,
				statusText: <string>response.statusText,
				url: <string>response.url,
				headers,
				body,
				waitingForBody: !response.__buffer__ && !!response.body
			});
		}

		return {
			status: <number>response.status,
			statusText: <string>response.statusText,
			url: <string>response.url,
			redirected: <boolean>response.redirected,
			headers,
			body
		};
	}

	/**
	 * Returns cached response.
	 *
	 * @returns Response.
	 */
	public getCachedResponse(): ISyncResponse | null {
		if (this.disableCache) {
			return null;
		}

		let cachedResponse = this.#browserFrame.page.context.responseCache.get(this.request);

		if (!cachedResponse || cachedResponse.response.waitingForBody) {
			return null;
		}

		if (
			cachedResponse.etag ||
			(cachedResponse.state === CachedResponseStateEnum.stale && cachedResponse.lastModified)
		) {
			const headers = new Headers(cachedResponse.request.headers);

			if (cachedResponse.etag) {
				headers.set('If-None-Match', cachedResponse.etag);
			} else {
				headers.set('If-Modified-Since', new Date(cachedResponse.lastModified).toUTCString());
			}

			const fetch = new (<typeof SyncFetch>this.constructor)({
				browserFrame: this.#browserFrame,
				window: this.#window,
				url: this.request.url,
				init: { headers, method: cachedResponse.request.method },
				disableCache: true
			});

			if (cachedResponse.etag || !cachedResponse.staleWhileRevalidate) {
				const validateResponse = <ISyncResponse>fetch.send();
				const body = validateResponse.status !== 304 ? validateResponse.body : null;

				cachedResponse = this.#browserFrame.page.context.responseCache.add(this.request, {
					...validateResponse,
					body,
					waitingForBody: false
				});

				if (validateResponse.status !== 304) {
					const response: ISyncResponse = {
                        body,
						status: validateResponse.status,
						statusText: validateResponse.statusText,
						headers: validateResponse.headers
					});
					(<string>response.url) = validateResponse.url;
					response.__cachedResponse__ = cachedResponse;

					return response;
				}
			} else {
				fetch.send().then((response) => {
					response.buffer().then((body: Buffer) => {
						this.#browserFrame.page.context.responseCache.add(this.request, {
							...response,
							body,
							waitingForBody: false
						});
					});
				});
			}
		}

		if (!cachedResponse || cachedResponse.response.waitingForBody) {
			return null;
		}

		const response = new this.#window.Response(cachedResponse.response.body, {
			status: cachedResponse.response.status,
			statusText: cachedResponse.response.statusText,
			headers: cachedResponse.response.headers
		});
		(<string>response.url) = cachedResponse.response.url;
		response.__cachedResponse__ = cachedResponse;

		return response;
	}

	private getScript(): string {
		const headers = {};
		for (const [key, value] of this.request.headers) {
			headers[key] = value;
		}

		return `
            import { Browser } from 'happy-dom';
            import Fetch from 'happy-dom/lib/fetch/Fetch.js';

            async function main() {
                const browser = new Browser({
                    settings: ${JSON.stringify(this.#browserFrame.page.context.browser.settings)},
                });
                const page = browser.createPage();
                page.mainFrame.url = '${this.#window.location.href}';
                const fetch = new Fetch({
                    window: page.mainFrame.window,
                    url: '${this.request.url}',
                    init: {
                        method: ${this.request.method},
                        headers: ${JSON.stringify(headers)},
                        body: Buffer.from('${this.request.__bodyBuffer__.toString(
													'base64'
												)}', 'base64'),
                        credentials: ${this.request.credentials},
                        redirect: ${this.request.redirect},
                        referrerPolicy: ${this.request.referrerPolicy},
                    },
                    disableCache: ${this.disableCache},
                    disableCrossOriginPolicy: ${this.disableCrossOriginPolicy}
                });
                let response;
                let buffer;
    
                try {
                    response = await fetch.send();
                    buffer = await response.buffer();
                } catch(error) {
                    console.log(JSON.stringify({ error: error.toString(), response: null }));
                    return;
                }

                const headers = {};
                    
                for (const [key, value] of response.headers) {
                    headers[key] = value;
                }

                console.log(JSON.stringify({
                    error: null,
                    response: {
                        status: response.status,
                        statusText: response.statusText,
                        redirected: response.redirected,
                        url: response.url,
                        headers,
                        body: buffer.toString('base64')
                    }
                }));
            }

            main();
        `;
	}
}
