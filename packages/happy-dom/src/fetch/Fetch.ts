import IRequestInit from './types/IRequestInit.js';
import IDocument from '../nodes/document/IDocument.js';
import IResponse from './types/IResponse.js';
import Request from './Request.js';
import IRequestInfo from './types/IRequestInfo.js';
import Headers from './Headers.js';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import Response from './Response.js';
import HTTP, { IncomingMessage } from 'http';
import HTTPS from 'https';
import Zlib from 'zlib';
import URL from '../url/URL.js';
import { Socket } from 'net';
import Stream from 'stream';
import DataURIParser from './data-uri/DataURIParser.js';
import FetchCORSUtility from './utilities/FetchCORSUtility.js';
import CookieJar from '../cookie/CookieJar.js';

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
	private ownerDocument: IDocument;
	private request: Request;
	private redirectCount = 0;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.document
	 * @param options.url URL.
	 * @param [options.init] Init.
	 * @param [options.ownerDocument] Owner document.
	 * @param [options.redirectCount] Redirect count.
	 * @param [options.contentType] Content Type.
	 */
	constructor(options: {
		ownerDocument: IDocument;
		url: IRequestInfo;
		init?: IRequestInit;
		redirectCount?: number;
		contentType?: string;
	}) {
		const url = options.url;

		this.ownerDocument = options.ownerDocument;
		this.request =
			typeof options.url === 'string' || options.url instanceof URL
				? new Request(options.url, options.init)
				: <Request>url;
		if (options.contentType) {
			(<string>this.request._contentType) = options.contentType;
		}
		this.redirectCount = options.redirectCount || 0;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	public send(): Promise<IResponse> {
		return new Promise((resolve, reject) => {
			const taskManager = this.ownerDocument.defaultView.happyDOM.asyncTaskManager;
			const taskID = taskManager.startTask(() => this.abort());

			if (this.resolve) {
				throw new Error('Fetch already sent.');
			}

			this.resolve = (response: IResponse | Promise<IResponse>): void => {
				taskManager.endTask(taskID);
				resolve(response);
			};
			this.reject = (error: Error): void => {
				taskManager.endTask(taskID);
				reject(error);
			};

			this.prepareRequest();
			this.validateRequest();

			if (this.request._url.protocol === 'data:') {
				const result = DataURIParser.parse(this.request.url);
				this.response = new Response(result.buffer, {
					headers: { 'Content-Type': result.type }
				});
				resolve(this.response);
				return;
			}

			if (this.request.signal.aborted) {
				this.abort();
				return;
			}

			this.request.signal.addEventListener('abort', this.listeners.onSignalAbort);

			const send = (this.request._url.protocol === 'https:' ? HTTPS : HTTP).request;

			this.nodeRequest = send(this.request._url.href, {
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
	 */
	private onSignalAbort(): void {
		this.finalizeRequest();
		this.abort();
	}

	/**
	 * Event listener for request "error" event.
	 *
	 * @param error Error.
	 */
	private onError(error: Error): void {
		this.finalizeRequest();
		this.ownerDocument.defaultView.console.error(error);
		this.reject(
			new DOMException(
				`Fetch to "${this.request.url}" failed. Error: ${error.message}`,
				DOMExceptionNameEnum.networkError
			)
		);
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

		const headers = this.getResponseHeaders(nodeResponse);

		if (this.handleRedirectResponse(nodeResponse, headers)) {
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
			headers
		};

		const contentEncodingHeader = headers.get('Content-Encoding');

		if (
			this.request.method === 'HEAD' ||
			contentEncodingHeader === null ||
			nodeResponse.statusCode === 204 ||
			nodeResponse.statusCode === 304
		) {
			this.response = new Response(body, responseOptions);
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
			this.response = new Response(body, responseOptions);
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

				this.response = new Response(body, responseOptions);
				(<boolean>this.response.redirected) = this.redirectCount > 0;
				(<string>this.response.url) = this.request.url;
				this.resolve(this.response);
			});
			raw.on('end', () => {
				// Some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
				if (!this.response) {
					this.response = new Response(body, responseOptions);
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
			this.response = new Response(body, responseOptions);
			(<boolean>this.response.redirected) = this.redirectCount > 0;
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// Otherwise, use response as is
		this.response = new Response(body, responseOptions);
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
				let body: Stream.Readable | Buffer | null = this.request._bodyBuffer;

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
						FetchCORSUtility.isCORS(this.ownerDocument.location, locationURL))
				) {
					headers.delete('authorization');
					headers.delete('www-authenticate');
					headers.delete('cookie');
					headers.delete('cookie2');
				}

				if (nodeResponse.statusCode !== 303 && this.request.body && !this.request._bodyBuffer) {
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
					ownerDocument: this.ownerDocument,
					url: locationURL,
					init: requestInit,
					redirectCount: this.redirectCount + 1,
					contentType: !shouldBecomeGetRequest ? this.request._contentType : undefined
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
			this.request._referrer = FetchRequestReferrerUtility.getSentReferrer(
				this.ownerDocument,
				this.request
			);
		} else {
			this.request._referrer = 'no-referrer';
		}
	}

	/**
	 * Validates the request.
	 *
	 * @throws {Error} Throws an error if the request is invalid.
	 */
	private validateRequest(): void {
		if (!SUPPORTED_SCHEMAS.includes(this.request._url.protocol)) {
			throw new DOMException(
				`Failed to fetch from "${
					this.request.url
				}": URL scheme "${this.request._url.protocol.replace(/:$/, '')}" is not supported.`,
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
		const document = this.ownerDocument;
		const isCORS = FetchCORSUtility.isCORS(document.location, this.request._url);

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
			headers.set('User-Agent', document.defaultView.navigator.userAgent);
		}

		if (this.request._referrer instanceof URL) {
			headers.set('Referer', this.request._referrer.href);
		}

		if (
			this.request.credentials === 'include' ||
			(this.request.credentials === 'same-origin' && !isCORS)
		) {
			const cookie = document.defaultView.document._cookie.getCookieString(
				this.ownerDocument.defaultView.location,
				false
			);
			if (cookie) {
				headers.set('Cookie', cookie);
			}
		}

		if (!headers.has('Accept')) {
			headers.set('Accept', '*/*');
		}

		if (!headers.has('Content-Length') && this.request._contentLength !== null) {
			headers.set('Content-Length', String(this.request._contentLength));
		}

		if (!headers.has('Content-Type') && this.request._contentType) {
			headers.set('Content-Type', this.request._contentType);
		}

		// We need to convert the headers to Node request headers.
		const httpRequestHeaders = {};

		for (const header of Object.values(headers._entries)) {
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
				const lowerKey = key.toLowerCase();

				// Handles setting cookie headers to the document.
				// "set-cookie" and "set-cookie2" are not allowed in response headers according to spec.
				if (lowerKey === 'set-cookie' || lowerKey === 'set-cookie2') {
					(<CookieJar>this.ownerDocument['_cookie']).addCookieString(this.request._url, header);
				} else {
					headers.append(key, header);
				}

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
	 */
	private abort(): void {
		const error = new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError);

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
