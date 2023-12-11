import IRequestInit from './types/IRequestInit.js';
import IResponse from './types/IResponse.js';
import IRequestInfo from './types/IRequestInfo.js';
import Headers from './Headers.js';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import HTTP, { IncomingMessage } from 'http';
import HTTPS from 'https';
import Zlib from 'zlib';
import URL from '../url/URL.js';
import { Socket } from 'net';
import Stream from 'stream';
import DataURIParser from './data-uri/DataURIParser.js';
import FetchCORSUtility from './utilities/FetchCORSUtility.js';
import Request from './Request.js';
import Response from './Response.js';
import Event from '../event/Event.js';
import AbortSignal from './AbortSignal.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import CookieStringUtility from '../cookie/urilities/CookieStringUtility.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import CachedResponseStateEnum from '../cache/response/CachedResponseStateEnum.js';

const SUPPORTED_SCHEMAS = ['data:', 'http:', 'https:'];
const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];
const LAST_CHUNK = Buffer.from('0\r\n\r\n');
const MAX_REDIRECT_COUNT = 20;

/**
 * Handles fetch requests.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/index.js
 *
 * @see https://fetch.spec.whatwg.org/#http-network-fetch
 */
export default class Fetch {
	private reject: (reason: Error) => void | null = null;
	private resolve: (value: IResponse | Promise<IResponse>) => void | null = null;
	private listeners = {
		onSignalAbort: this.onSignalAbort.bind(this)
	};
	private isChunkedTransfer = false;
	private isProperLastChunkReceived = false;
	private previousChunk: Buffer | null = null;
	private nodeRequest: HTTP.ClientRequest | null = null;
	private response: Response | null = null;
	private responseHeaders: Headers | null = null;
	private request: Request;
	private redirectCount = 0;
	private disableCache: boolean;
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
		redirectCount?: number;
		contentType?: string;
		disableCache?: boolean;
	}) {
		const url = options.url;

		this.#browserFrame = options.browserFrame;
		this.#window = options.window;
		this.request =
			typeof options.url === 'string' || options.url instanceof URL
				? new options.browserFrame.window.Request(options.url, options.init)
				: <Request>url;
		if (options.contentType) {
			(<string>this.request.__contentType__) = options.contentType;
		}
		this.redirectCount = options.redirectCount || 0;
		this.disableCache = options.disableCache;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	public async send(): Promise<IResponse> {
		if (this.disableCache) {
			return this.sendWithoutCache();
		}

		let cachedResponse = this.#browserFrame.page.context.responseCache.get(this.request);

		if (cachedResponse) {
			if (
				cachedResponse.etag ||
				(cachedResponse.state === CachedResponseStateEnum.stale && cachedResponse.lastModified)
			) {
				const headers = cachedResponse.etag
					? { ...cachedResponse.requestHeaders, 'If-None-Match': cachedResponse.etag }
					: {
							...cachedResponse.requestHeaders,
							'If-Modified-Since': new Date(cachedResponse.lastModified).toUTCString()
					  };

				const fetch = new (<typeof Fetch>this.constructor)({
					browserFrame: this.#browserFrame,
					window: this.#window,
					url: this.request.url,
					init: { headers },
					disableCache: true
				});

				if (!cachedResponse.etag && cachedResponse.staleWhileRevalidate) {
					fetch.send().then((response) => {
						response.buffer().then((body: Buffer) => {
							this.#browserFrame.page.context.responseCache.add(this.request, {
								...response,
								body,
								waitingForBody: false
							});
						});
					});
				} else {
					const response = <Response>await fetch.send();
					const body = response.status !== 304 ? await response.buffer() : null;
					cachedResponse = this.#browserFrame.page.context.responseCache.add(this.request, {
						...response,
						body,
						waitingForBody: false
					});
				}
			}

			if (cachedResponse && !cachedResponse.response?.waitingForBody) {
				const response = new this.#window.Response(cachedResponse.response.body, {
					status: cachedResponse.response.status,
					statusText: cachedResponse.response.statusText,
					headers: cachedResponse.response.headers
				});
				(<string>response.url) = cachedResponse.response.url;
				response.__cachedResponse__ = cachedResponse;

				return response;
			}
		}

		return this.sendWithoutCache();
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	private sendWithoutCache(): Promise<IResponse> {
		return new Promise((resolve, reject) => {
			const taskID = this.#browserFrame.__asyncTaskManager__.startTask(() =>
				this.onAsyncTaskManagerAbort()
			);

			if (this.resolve) {
				throw new Error('Fetch already sent.');
			}

			this.resolve = (response: IResponse | Promise<IResponse>): void => {
				if (!this.disableCache && response instanceof Response) {
					response.__cachedResponse__ = this.#browserFrame.page.context.responseCache.add(
						this.request,
						{
							...response,
							headers: this.responseHeaders,
							body: response.__buffer__,
							waitingForBody: !response.__buffer__ && !!response.body
						}
					);
				}
				this.#browserFrame.__asyncTaskManager__.endTask(taskID);
				resolve(response);
			};
			this.reject = (error: Error): void => {
				this.#browserFrame.__asyncTaskManager__.endTask(taskID);
				reject(error);
			};

			this.prepareRequest();
			this.validateRequest();

			if (this.request.__url__.protocol === 'data:') {
				const result = DataURIParser.parse(this.request.url);
				this.response = new this.#window.Response(result.buffer, {
					headers: { 'Content-Type': result.type }
				});
				this.#browserFrame.__asyncTaskManager__.endTask(taskID);
				resolve(this.response);
				return;
			}

			if (this.request.signal.aborted) {
				this.abort();
				return;
			}

			this.request.signal.addEventListener('abort', this.listeners.onSignalAbort);

			const send = (this.request.__url__.protocol === 'https:' ? HTTPS : HTTP).request;

			// Security check for "https" to "http" requests.
			if (
				this.request.__url__.protocol === 'http:' &&
				this.#window.location.protocol === 'https:'
			) {
				throw new DOMException(
					`Mixed Content: The page at '${
						this.#window.location.href
					}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${
						this.request.url
					}'. This request has been blocked; the content must be served over HTTPS.`,
					DOMExceptionNameEnum.securityError
				);
			}

			this.nodeRequest = send(this.request.__url__.href, {
				method: this.request.method,
				headers: this.getRequestHeaders()
			});

			this.nodeRequest.on('error', this.onError.bind(this));
			this.nodeRequest.on('socket', this.onSocket.bind(this));
			this.nodeRequest.on('response', this.onResponse.bind(this));

			if (this.request.body === null) {
				this.nodeRequest.end();
			} else {
				Stream.pipeline(this.request.body, this.nodeRequest, (error) => {
					if (error) {
						this.onError(error);
					}
				});
			}
		});
	}

	/**
	 * Event listener for "socket" event.
	 *
	 * @param socket Socket.
	 */
	private onSocket(socket: Socket): void {
		const onSocketClose = (): void => {
			if (this.isChunkedTransfer && !this.isProperLastChunkReceived) {
				const error = new DOMException('Premature close.', DOMExceptionNameEnum.networkError);

				if (this.response && this.response.body) {
					this.response.body.destroy(error);
				}
			}
		};

		const onData = (buffer: Buffer): void => {
			this.isProperLastChunkReceived = Buffer.compare(buffer.slice(-5), LAST_CHUNK) === 0;

			// Sometimes final 0-length chunk and end of message code are in separate packets.
			if (!this.isProperLastChunkReceived && this.previousChunk) {
				this.isProperLastChunkReceived =
					Buffer.compare(this.previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 &&
					Buffer.compare(buffer.slice(-2), LAST_CHUNK.slice(3)) === 0;
			}

			this.previousChunk = buffer;
		};

		socket.prependListener('close', onSocketClose);
		socket.on('data', onData);

		this.nodeRequest.on('close', () => {
			socket.removeListener('close', onSocketClose);
			socket.removeListener('data', onData);
		});
	}

	/**
	 * Event listener for signal "abort" event.
	 *
	 * @param event Event.
	 */
	private onSignalAbort(event: Event): void {
		this.finalizeRequest();
		this.abort((<AbortSignal>event.target)?.reason);
	}

	/**
	 * Event listener for request "error" event.
	 *
	 * @param error Error.
	 */
	private onError(error: Error): void {
		this.finalizeRequest();
		this.#window.console.error(error);
		this.reject(
			new DOMException(
				`Fetch to "${this.request.url}" failed. Error: ${error.message}`,
				DOMExceptionNameEnum.networkError
			)
		);
	}

	/**
	 * Triggered when the async task manager aborts.
	 */
	private onAsyncTaskManagerAbort(): void {
		const error = new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError);

		if (this.request.body) {
			this.request.body.destroy(error);
		}

		if (!this.response || !this.response.body) {
			return;
		}

		this.response.body.emit('error', error);
	}

	/**
	 * Event listener for request "response" event.
	 *
	 * @param nodeResponse Node response.
	 */
	private onResponse(nodeResponse: IncomingMessage): void {
		// Needed for handling bad endings of chunked transfer.
		this.isChunkedTransfer =
			nodeResponse.headers['transfer-encoding'] === 'chunked' &&
			!nodeResponse.headers['content-length'];

		this.nodeRequest.setTimeout(0);
		this.responseHeaders = this.getResponseHeaders(nodeResponse);

		if (this.handleRedirectResponse(nodeResponse, this.responseHeaders)) {
			return;
		}

		nodeResponse.once('end', () =>
			this.request.signal.removeEventListener('abort', this.listeners.onSignalAbort)
		);

		let body = Stream.pipeline(nodeResponse, new Stream.PassThrough(), (error: Error) => {
			if (error) {
				// Ignore error as it is forwarded to the response body.
			}
		});

		const responseOptions = {
			status: nodeResponse.statusCode,
			statusText: nodeResponse.statusMessage,
			headers: this.responseHeaders
		};

		const contentEncodingHeader = this.responseHeaders.get('Content-Encoding');

		if (
			this.request.method === 'HEAD' ||
			contentEncodingHeader === null ||
			nodeResponse.statusCode === 204 ||
			nodeResponse.statusCode === 304
		) {
			this.response = new this.#window.Response(body, responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// Be less strict when decoding compressed responses.
		// Sometimes servers send slightly invalid responses that are still accepted by common browsers.
		// "cURL" always uses Z_SYNC_FLUSH.
		const zlibOptions = {
			flush: Zlib.constants.Z_SYNC_FLUSH,
			finishFlush: Zlib.constants.Z_SYNC_FLUSH
		};

		// For GZip
		if (contentEncodingHeader === 'gzip' || contentEncodingHeader === 'x-gzip') {
			body = Stream.pipeline(body, Zlib.createGunzip(zlibOptions), (error: Error) => {
				if (error) {
					// Ignore error as it is forwarded to the response body.
				}
			});
			this.response = new this.#window.Response(body, responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// For Deflate
		if (contentEncodingHeader === 'deflate' || contentEncodingHeader === 'x-deflate') {
			// Handle the infamous raw deflate response from old servers
			// A hack for old IIS and Apache servers
			const raw = Stream.pipeline(nodeResponse, new Stream.PassThrough(), (error) => {
				if (error) {
					// Ignore error as it is forwarded to the response body.
				}
			});
			raw.on('data', (chunk) => {
				// See http://stackoverflow.com/questions/37519828
				if ((chunk[0] & 0x0f) === 0x08) {
					body = Stream.pipeline(body, Zlib.createInflate(), (error) => {
						if (error) {
							// Ignore error as the fetch() promise has already been resolved.
						}
					});
				} else {
					body = Stream.pipeline(body, Zlib.createInflateRaw(), (error) => {
						if (error) {
							// Ignore error as it is forwarded to the response body.
						}
					});
				}

				this.response = new this.#window.Response(body, responseOptions);
				(<boolean>this.response.redirected) = this.redirectCount > 0;
				(<string>this.response.url) = this.request.url;
				this.resolve(this.response);
			});
			raw.on('end', () => {
				// Some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
				if (!this.response) {
					this.response = new this.#window.Response(body, responseOptions);
					(<boolean>this.response.redirected) = this.redirectCount > 0;
					(<string>this.response.url) = this.request.url;
					this.resolve(this.response);
				}
			});
			return;
		}

		// For BR
		if (contentEncodingHeader === 'br') {
			body = Stream.pipeline(body, Zlib.createBrotliDecompress(), (error) => {
				if (error) {
					// Ignore error as it is forwarded to the response body.
				}
			});
			this.response = new this.#window.Response(body, responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// Otherwise, use response as is
		this.response = new this.#window.Response(body, responseOptions);
		(<boolean>this.response.redirected) = this.redirectCount > 0;
		(<string>this.response.url) = this.request.url;
		this.resolve(this.response);
	}

	/**
	 * Handles redirect response.
	 *
	 * @param nodeResponse Node response.
	 * @param responseHeaders Headers.
	 * @returns True if redirect response was handled, false otherwise.
	 */
	private handleRedirectResponse(nodeResponse: IncomingMessage, responseHeaders: Headers): boolean {
		if (!this.isRedirect(nodeResponse.statusCode)) {
			return false;
		}

		switch (this.request.redirect) {
			case 'error':
				this.finalizeRequest();
				this.reject(
					new DOMException(
						`URI requested responds with a redirect, redirect mode is set to "error": ${this.request.url}`,
						DOMExceptionNameEnum.abortError
					)
				);
				return true;
			case 'manual':
				// Nothing to do
				return false;
			case 'follow':
				const locationHeader = responseHeaders.get('Location');
				const shouldBecomeGetRequest =
					nodeResponse.statusCode === 303 ||
					((nodeResponse.statusCode === 301 || nodeResponse.statusCode === 302) &&
						this.request.method === 'POST');
				let locationURL: URL = null;

				if (locationHeader !== null) {
					try {
						locationURL = new URL(locationHeader, this.request.url);
					} catch {
						this.finalizeRequest();
						this.reject(
							new DOMException(
								`URI requested responds with an invalid redirect URL: ${locationHeader}`,
								DOMExceptionNameEnum.uriMismatchError
							)
						);
						return true;
					}
				}

				if (locationURL === null) {
					return false;
				}

				if (this.redirectCount >= MAX_REDIRECT_COUNT) {
					this.finalizeRequest();
					this.reject(
						new DOMException(
							`Maximum redirects reached at: ${this.request.url}`,
							DOMExceptionNameEnum.networkError
						)
					);
					return true;
				}

				const headers = new Headers(this.request.headers);
				let body: Stream.Readable | Buffer | null = this.request.__bodyBuffer__;

				if (!body && this.request.body) {
					// Piping a used request body is not possible.
					if (this.request.bodyUsed) {
						throw new DOMException(
							'It is not possible to pipe a body after it is used.',
							DOMExceptionNameEnum.networkError
						);
					}

					body = new Stream.PassThrough();
					this.request.body.pipe(<Stream.PassThrough>body);
				}

				const requestInit: IRequestInit = {
					method: this.request.method,
					signal: this.request.signal,
					referrer: this.request.referrer,
					referrerPolicy: this.request.referrerPolicy,
					credentials: this.request.credentials,
					headers,
					body
				};

				// TODO: Maybe we need to add support for OPTIONS request with 'Access-Control-Allow-*' headers?
				if (
					this.request.credentials === 'omit' ||
					(this.request.credentials === 'same-origin' &&
						FetchCORSUtility.isCORS(this.#window.location, locationURL))
				) {
					headers.delete('authorization');
					headers.delete('www-authenticate');
					headers.delete('cookie');
					headers.delete('cookie2');
				}

				if (nodeResponse.statusCode !== 303 && this.request.body && !this.request.__bodyBuffer__) {
					this.finalizeRequest();
					this.reject(
						new DOMException(
							'Cannot follow redirect with body being a readable stream.',
							DOMExceptionNameEnum.networkError
						)
					);
					return true;
				}

				if (this.request.signal.aborted) {
					this.abort();
					return true;
				}

				if (shouldBecomeGetRequest) {
					requestInit.method = 'GET';
					requestInit.body = undefined;
					headers.delete('Content-Length');
					headers.delete('Content-Type');
				}

				const responseReferrerPolicy =
					FetchRequestReferrerUtility.getReferrerPolicyFromHeader(headers);
				if (responseReferrerPolicy) {
					requestInit.referrerPolicy = responseReferrerPolicy;
				}

				const fetch = new (<typeof Fetch>this.constructor)({
					browserFrame: this.#browserFrame,
					window: this.#window,
					url: locationURL,
					init: requestInit,
					redirectCount: this.redirectCount + 1,
					contentType: !shouldBecomeGetRequest ? this.request.__contentType__ : undefined
				});

				this.finalizeRequest();
				this.resolve(fetch.send());
				return true;
			default:
				this.finalizeRequest();
				this.reject(
					new DOMException(
						`Redirect option '${this.request.redirect}' is not a valid value of RequestRedirect`
					)
				);
				return true;
		}
	}

	/**
	 * Prepares the request before being sent.
	 */
	private prepareRequest(): void {
		if (!this.request.referrerPolicy) {
			(<string>this.request.referrerPolicy) = 'strict-origin-when-cross-origin';
		}

		if (this.request.referrer && this.request.referrer !== 'no-referrer') {
			this.request.__referrer__ = FetchRequestReferrerUtility.getSentReferrer(
				this.#window,
				this.request
			);
		} else {
			this.request.__referrer__ = 'no-referrer';
		}
	}

	/**
	 * Validates the request.
	 *
	 * @throws {Error} Throws an error if the request is invalid.
	 */
	private validateRequest(): void {
		if (!SUPPORTED_SCHEMAS.includes(this.request.__url__.protocol)) {
			throw new DOMException(
				`Failed to fetch from "${
					this.request.url
				}": URL scheme "${this.request.__url__.protocol.replace(/:$/, '')}" is not supported.`,
				DOMExceptionNameEnum.notSupportedError
			);
		}
	}

	/**
	 * Returns request headers.
	 *
	 * @returns Headers.
	 */
	private getRequestHeaders(): { [key: string]: string } {
		const headers = new Headers(this.request.headers);
		const isCORS = FetchCORSUtility.isCORS(this.#window.location, this.request.__url__);

		// TODO: Maybe we need to add support for OPTIONS request with 'Access-Control-Allow-*' headers?
		if (
			this.request.credentials === 'omit' ||
			(this.request.credentials === 'same-origin' && isCORS)
		) {
			headers.delete('authorization');
			headers.delete('www-authenticate');
		}

		headers.set('Accept-Encoding', 'gzip, deflate, br');
		headers.set('Connection', 'close');

		if (!headers.has('User-Agent')) {
			headers.set('User-Agent', this.#window.navigator.userAgent);
		}

		if (this.request.__referrer__ instanceof URL) {
			headers.set('Referer', this.request.__referrer__.href);
		}

		if (
			this.request.credentials === 'include' ||
			(this.request.credentials === 'same-origin' && !isCORS)
		) {
			const cookies = this.#browserFrame.page.context.cookieContainer.getCookies(
				this.#window.location,
				false
			);
			if (cookies.length > 0) {
				headers.set('Cookie', CookieStringUtility.cookiesToString(cookies));
			}
		}

		if (!headers.has('Accept')) {
			headers.set('Accept', '*/*');
		}

		if (!headers.has('Content-Length') && this.request.__contentLength__ !== null) {
			headers.set('Content-Length', String(this.request.__contentLength__));
		}

		if (!headers.has('Content-Type') && this.request.__contentType__) {
			headers.set('Content-Type', this.request.__contentType__);
		}

		// We need to convert the headers to Node request headers.
		const httpRequestHeaders = {};

		for (const header of Object.values(headers.__entries__)) {
			httpRequestHeaders[header.name] = header.value;
		}

		return httpRequestHeaders;
	}

	/**
	 * Returns "true" if redirect.
	 *
	 * @param statusCode Status code.
	 * @returns "true" if redirect.
	 */
	private isRedirect(statusCode: number): boolean {
		return REDIRECT_STATUS_CODES.includes(statusCode);
	}

	/**
	 * Appends headers to response.
	 *
	 * @param nodeResponse HTTP request.
	 * @returns Headers.
	 */
	private getResponseHeaders(nodeResponse: IncomingMessage): Headers {
		const headers = new Headers();
		let key = null;

		for (const header of nodeResponse.rawHeaders) {
			if (!key) {
				key = header;
			} else {
				const lowerName = key.toLowerCase();
				// Handles setting cookie headers to the document.
				if (lowerName === 'set-cookie' || lowerName === 'set-cookie2') {
					this.#browserFrame.page.context.cookieContainer.addCookies([
						CookieStringUtility.stringToCookie(this.request.__url__, header)
					]);
				}
				headers.append(key, header);
				key = null;
			}
		}

		return headers;
	}

	/**
	 * Finalizes the request.
	 */
	private finalizeRequest(): void {
		this.request.signal.removeEventListener('abort', this.listeners.onSignalAbort);
		this.nodeRequest.destroy();
	}

	/**
	 * Aborts the request.
	 *
	 * @param reason Reason.
	 */
	private abort(reason?: string): void {
		const error = new DOMException(
			'The operation was aborted.' + (reason ? ' ' + reason : ''),
			DOMExceptionNameEnum.abortError
		);

		if (this.request.body) {
			this.request.body.destroy(error);
		}

		if (!this.response || !this.response.body) {
			if (this.reject) {
				this.reject(error);
			}
			return;
		}

		this.response.body.emit('error', error);

		if (this.reject) {
			this.reject(error);
		}
	}
}
