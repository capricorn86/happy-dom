import IRequestInit from './types/IRequestInit.js';
import * as PropertySymbol from '../PropertySymbol.js';
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
import { ReadableStream } from 'stream/web';
import Request from './Request.js';
import Response from './Response.js';
import Event from '../event/Event.js';
import AbortSignal from './AbortSignal.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import CachedResponseStateEnum from './cache/response/CachedResponseStateEnum.js';
import FetchRequestHeaderUtility from './utilities/FetchRequestHeaderUtility.js';
import FetchRequestValidationUtility from './utilities/FetchRequestValidationUtility.js';
import FetchResponseRedirectUtility from './utilities/FetchResponseRedirectUtility.js';
import FetchResponseHeaderUtility from './utilities/FetchResponseHeaderUtility.js';
import FetchHTTPSCertificate from './certificate/FetchHTTPSCertificate.js';
import { Buffer } from 'buffer';

const LAST_CHUNK = Buffer.from('0\r\n\r\n');

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
	private nodeResponse: IncomingMessage | null = null;
	private response: Response | null = null;
	private responseHeaders: Headers | null = null;
	private request: Request;
	private redirectCount = 0;
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
	 * @param [options.disableCrossOriginPolicy] Disables the Cross-Origin policy.
	 */
	constructor(options: {
		browserFrame: IBrowserFrame;
		window: IBrowserWindow;
		url: IRequestInfo;
		init?: IRequestInit;
		redirectCount?: number;
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
			(<string>this.request[PropertySymbol.contentType]) = options.contentType;
		}
		this.redirectCount = options.redirectCount ?? 0;
		this.disableCache = options.disableCache ?? false;
		this.disableCrossOriginPolicy = options.disableCrossOriginPolicy ?? false;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	public async send(): Promise<IResponse> {
		FetchRequestReferrerUtility.prepareRequest(this.#window.location, this.request);
		FetchRequestValidationUtility.validateSchema(this.request);

		if (this.request.signal.aborted) {
			throw new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError);
		}

		if (this.request[PropertySymbol.url].protocol === 'data:') {
			const result = DataURIParser.parse(this.request.url);
			this.response = new this.#window.Response(result.buffer, {
				headers: { 'Content-Type': result.type }
			});
			return this.response;
		}

		// Security check for "https" to "http" requests.
		if (
			this.request[PropertySymbol.url].protocol === 'http:' &&
			this.#window.location.protocol === 'https:'
		) {
			throw new DOMException(
				`Mixed Content: The page at '${this.#window.location.href}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${this.request.url}'. This request has been blocked; the content must be served over HTTPS.`,
				DOMExceptionNameEnum.securityError
			);
		}

		if (!this.disableCache) {
			const cachedResponse = await this.getCachedResponse();

			if (cachedResponse) {
				return cachedResponse;
			}
		}

		if (!this.disableCrossOriginPolicy) {
			const compliesWithCrossOriginPolicy = await this.compliesWithCrossOriginPolicy();

			if (!compliesWithCrossOriginPolicy) {
				this.#window.console.warn(
					`Cross-Origin Request Blocked: The Same Origin Policy dissallows reading the remote resource at "${this.request.url}".`
				);
				throw new DOMException(
					`Cross-Origin Request Blocked: The Same Origin Policy dissallows reading the remote resource at "${this.request.url}".`,
					DOMExceptionNameEnum.networkError
				);
			}
		}

		return await this.sendRequest();
	}

	/**
	 * Returns cached response.
	 *
	 * @returns Response.
	 */
	private async getCachedResponse(): Promise<IResponse | null> {
		if (this.disableCache) {
			return null;
		}

		let cachedResponse = this.#browserFrame.page.context.responseCache.get(this.request);

		if (!cachedResponse || cachedResponse.response.waitingForBody) {
			return null;
		}

		if (cachedResponse.state === CachedResponseStateEnum.stale) {
			const headers = new Headers(cachedResponse.request.headers);

			if (cachedResponse.etag) {
				headers.set('If-None-Match', cachedResponse.etag);
			} else {
				if (!cachedResponse.lastModified) {
					return null;
				}
				headers.set('If-Modified-Since', new Date(cachedResponse.lastModified).toUTCString());
			}

			const fetch = new Fetch({
				browserFrame: this.#browserFrame,
				window: this.#window,
				url: this.request.url,
				init: { headers, method: cachedResponse.request.method },
				disableCache: true,
				disableCrossOriginPolicy: true
			});

			if (cachedResponse.etag || !cachedResponse.staleWhileRevalidate) {
				const validateResponse = <Response>await fetch.send();
				const body = validateResponse.status !== 304 ? await validateResponse.buffer() : null;

				cachedResponse = this.#browserFrame.page.context.responseCache.add(this.request, {
					...validateResponse,
					body,
					waitingForBody: false
				});

				if (validateResponse.status !== 304) {
					const response = new this.#window.Response(body, {
						status: validateResponse.status,
						statusText: validateResponse.statusText,
						headers: validateResponse.headers
					});
					(<string>response.url) = validateResponse.url;
					response[PropertySymbol.cachedResponse] = cachedResponse;

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
		response[PropertySymbol.cachedResponse] = cachedResponse;

		return response;
	}

	/**
	 * Checks if the request complies with the Cross-Origin policy.
	 *
	 * @returns True if it complies with the policy.
	 */
	private async compliesWithCrossOriginPolicy(): Promise<boolean> {
		if (
			this.disableCrossOriginPolicy ||
			!FetchCORSUtility.isCORS(this.#window.location, this.request[PropertySymbol.url])
		) {
			return true;
		}

		const cachedPreflightResponse = this.#browserFrame.page.context.preflightResponseCache.get(
			this.request
		);

		if (cachedPreflightResponse) {
			if (
				cachedPreflightResponse.allowOrigin !== '*' &&
				cachedPreflightResponse.allowOrigin !== this.#window.location.origin
			) {
				return false;
			}

			if (
				cachedPreflightResponse.allowMethods.length !== 0 &&
				!cachedPreflightResponse.allowMethods.includes(this.request.method)
			) {
				return false;
			}

			return true;
		}

		const requestHeaders = [];

		for (const [header] of this.request.headers) {
			requestHeaders.push(header);
		}

		const fetch = new Fetch({
			browserFrame: this.#browserFrame,
			window: this.#window,
			url: this.request.url,
			init: {
				method: 'OPTIONS',
				headers: new Headers({
					'Access-Control-Request-Method': this.request.method,
					'Access-Control-Request-Headers': requestHeaders.join(', ')
				})
			},
			disableCache: true,
			disableCrossOriginPolicy: true
		});

		const response = <Response>await fetch.send();

		if (!response.ok) {
			return false;
		}

		const allowOrigin = response.headers.get('Access-Control-Allow-Origin');

		if (!allowOrigin) {
			return false;
		}

		if (allowOrigin !== '*' && allowOrigin !== this.#window.location.origin) {
			return false;
		}

		const allowMethods: string[] = [];

		if (response.headers.has('Access-Control-Allow-Methods')) {
			const allowMethodsHeader = response.headers.get('Access-Control-Allow-Methods');
			if (allowMethodsHeader !== '*') {
				for (const method of allowMethodsHeader.split(',')) {
					allowMethods.push(method.trim().toUpperCase());
				}
			}
		}

		if (allowMethods.length !== 0 && !allowMethods.includes(this.request.method)) {
			return false;
		}

		// TODO: Add support for more Access-Control-Allow-* headers.

		return true;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	private sendRequest(): Promise<IResponse> {
		return new Promise((resolve, reject) => {
			const taskID = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask(() =>
				this.onAsyncTaskManagerAbort()
			);

			if (this.resolve) {
				throw new Error('Fetch already sent.');
			}

			this.resolve = (response: IResponse | Promise<IResponse>): void => {
				// We can end up here when closing down the browser frame and there is an ongoing request.
				// Therefore we need to check if browserFrame.page.context is still available.
				if (
					!this.disableCache &&
					response instanceof Response &&
					this.#browserFrame.page &&
					this.#browserFrame.page.context
				) {
					response[PropertySymbol.cachedResponse] =
						this.#browserFrame.page.context.responseCache.add(this.request, {
							...response,
							headers: this.responseHeaders,
							body: response[PropertySymbol.buffer],
							waitingForBody: !response[PropertySymbol.buffer] && !!response.body
						});
				}
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
				resolve(response);
			};
			this.reject = (error: Error): void => {
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
				reject(error);
			};

			this.request.signal.addEventListener('abort', this.listeners.onSignalAbort);

			const send = (this.request[PropertySymbol.url].protocol === 'https:' ? HTTPS : HTTP).request;

			this.nodeRequest = send(this.request[PropertySymbol.url].href, {
				method: this.request.method,
				headers: FetchRequestHeaderUtility.getRequestHeaders({
					browserFrame: this.#browserFrame,
					window: this.#window,
					request: this.request
				}),
				agent: false,
				rejectUnauthorized: true,
				key:
					this.request[PropertySymbol.url].protocol === 'https:'
						? FetchHTTPSCertificate.key
						: undefined,
				cert:
					this.request[PropertySymbol.url].protocol === 'https:'
						? FetchHTTPSCertificate.cert
						: undefined
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
					this.response.body[PropertySymbol.error] = error;
					if (!this.response.body.locked) {
						this.response.body.cancel(error);
					}
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

		if (this.nodeRequest && !this.nodeRequest.destroyed) {
			this.nodeRequest.destroy(error);
		}

		if (this.nodeResponse && !this.nodeResponse.destroyed) {
			this.nodeResponse.destroy(error);
		}

		if (this.response && this.response.body) {
			this.response.body[PropertySymbol.error] = error;
			if (!this.response.body.locked) {
				this.response.body.cancel(error);
			}
		}
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
		this.responseHeaders = FetchResponseHeaderUtility.parseResponseHeaders({
			browserFrame: this.#browserFrame,
			requestURL: this.request[PropertySymbol.url],
			rawHeaders: nodeResponse.rawHeaders
		});

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
			this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// For GZip
		if (contentEncodingHeader === 'gzip' || contentEncodingHeader === 'x-gzip') {
			// Be less strict when decoding compressed responses.
			// Sometimes servers send slightly invalid responses that are still accepted by common browsers.
			// "cURL" always uses Z_SYNC_FLUSH.
			const zlibOptions = {
				flush: Zlib.constants.Z_SYNC_FLUSH,
				finishFlush: Zlib.constants.Z_SYNC_FLUSH
			};

			body = Stream.pipeline(body, Zlib.createGunzip(zlibOptions), (error: Error) => {
				if (error) {
					// Ignore error as it is forwarded to the response body.
				}
			});
			this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
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

				this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
				(<boolean>this.response.redirected) = this.redirectCount > 0;
				(<string>this.response.url) = this.request.url;
				this.resolve(this.response);
			});
			raw.on('end', () => {
				// Some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
				if (!this.response) {
					this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
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
			this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// Otherwise, use response as is
		this.response = new this.#window.Response(this.nodeToWebStream(body), responseOptions);
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
		if (!FetchResponseRedirectUtility.isRedirect(nodeResponse.statusCode)) {
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

				if (FetchResponseRedirectUtility.isMaxRedirectsReached(this.redirectCount)) {
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
				const requestInit: IRequestInit = {
					method: this.request.method,
					signal: this.request.signal,
					referrer: this.request.referrer,
					referrerPolicy: this.request.referrerPolicy,
					credentials: this.request.credentials,
					headers,
					body: this.request[PropertySymbol.bodyBuffer]
				};

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

				const fetch = new Fetch({
					browserFrame: this.#browserFrame,
					window: this.#window,
					url: locationURL,
					init: requestInit,
					redirectCount: this.redirectCount + 1,
					contentType: !shouldBecomeGetRequest
						? this.request[PropertySymbol.contentType]
						: undefined
				});

				this.finalizeRequest();
				fetch
					.send()
					.then((response) => this.resolve(response))
					.catch((error) => this.reject(error));
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

		if (this.nodeRequest && !this.nodeRequest.destroyed) {
			this.nodeRequest.destroy(error);
		}

		if (this.nodeResponse && !this.nodeResponse.destroyed) {
			this.nodeResponse.destroy(error);
		}

		if (this.response && this.response.body) {
			this.response.body[PropertySymbol.error] = error;
			if (!this.response.body.locked) {
				this.response.body.cancel(error);
			}
		}

		if (this.reject) {
			this.reject(error);
		}
	}

	/**
	 * Wraps a Node.js stream into a browser-compatible ReadableStream.
	 *
	 * Enables the use of Node.js streams where browser ReadableStreams are required.
	 * Handles 'data', 'end', and 'error' events from the Node.js stream.
	 *
	 * @param nodeStream The Node.js stream to be converted.
	 * @returns ReadableStream
	 */
	private nodeToWebStream(nodeStream: Stream): ReadableStream {
		return new ReadableStream({
			start(controller) {
				nodeStream.on('data', (chunk) => {
					controller.enqueue(chunk);
				});

				nodeStream.on('end', () => {
					controller.close();
				});

				nodeStream.on('error', (err) => {
					controller.error(err);
				});
			}
		});
	}
}
