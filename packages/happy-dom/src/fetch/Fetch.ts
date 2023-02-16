import IRequestInit from './types/IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './types/IResponse';
import Request from './Request';
import IRequestInfo from './types/IRequestInfo';
import Headers from './Headers';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import Response from './Response';
import HTTP, { IncomingMessage } from 'http';
import HTTPS from 'https';
import Zlib from 'zlib';
import { URL } from 'url';
import { Socket } from 'net';
import Stream from 'stream';
import DataURIParser from './data-uri/DataURIParser';

const SUPPORTED_SCHEMAS = ['data:', 'http:', 'https:'];
const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];
const UNSAFE_CORS_REDIRECT_HEADERS = ['authorization', 'www-authenticate', 'cookie', 'cookie2'];
const LAST_CHUNK = Buffer.from('0\r\n\r\n');
const MAX_REDIRECT_COUNT = 20;

/* eslint-disable @typescript-eslint/member-ordering */

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
	 * @param options.ownerDocument
	 * @param options.redirectCount
	 */
	constructor(options: {
		ownerDocument: IDocument;
		url: IRequestInfo;
		init?: IRequestInit;
		redirectCount?: number;
	}) {
		const url = options.url;

		this.ownerDocument = options.ownerDocument;
		this.request =
			typeof options.url === 'string' || options.url instanceof URL
				? new Request(options.url, options.init)
				: <Request>url;
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
				resolve(response);
				taskManager.endTask(taskID);
			};
			this.reject = (error: Error): void => {
				reject(error);
				taskManager.endTask(taskID);
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

		if (this.isRedirect(nodeResponse.statusCode)) {
			this.handleRedirectResponse(nodeResponse, headers);
			return;
		}

		nodeResponse.once('end', () =>
			this.request.signal.removeEventListener('abort', this.listeners.onSignalAbort)
		);

		let body = Stream.pipeline(nodeResponse, new Stream.PassThrough(), (error: Error) => {
			if (error) {
				this.reject(error);
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
					this.reject(error);
				}
			});
			this.response = new Response(body, responseOptions);
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
					this.reject(error);
				}
			});
			raw.once('data', (chunk) => {
				// See http://stackoverflow.com/questions/37519828
				if ((chunk[0] & 0x0f) === 0x08) {
					body = Stream.pipeline(body, Zlib.createInflate(), (error) => {
						if (error) {
							this.reject(error);
						}
					});
				} else {
					body = Stream.pipeline(body, Zlib.createInflateRaw(), (error) => {
						if (error) {
							this.reject(error);
						}
					});
				}

				this.response = new Response(body, responseOptions);
				(<string>this.response.url) = this.request.url;
				this.resolve(this.response);
			});
			raw.once('end', () => {
				// Some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
				if (!this.response) {
					this.response = new Response(body, responseOptions);
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
					this.reject(error);
				}
			});
			this.response = new Response(body, responseOptions);
			(<string>this.response.url) = this.request.url;
			this.resolve(this.response);
			return;
		}

		// Otherwise, use response as is
		this.response = new Response(body, responseOptions);
		(<string>this.response.url) = this.request.url;
		this.resolve(this.response);
	}

	/**
	 * Handles redirect response.
	 *
	 * @param nodeResponse Node response.
	 * @param headers Headers.
	 */
	private handleRedirectResponse(nodeResponse: IncomingMessage, headers: Headers): void {
		const locationHeader = headers.get('Location');
		let locationURL: URL = null;

		try {
			locationURL = locationHeader === null ? null : new URL(locationHeader, this.request.url);
		} catch {
			// Error here can only be invalid URL in Location: header
			// Do not throw when options.redirect == manual
			// Let the user extract the errorneous redirect URL
			if (this.request.redirect !== 'manual') {
				this.finalizeRequest();
				this.reject(
					new DOMException(
						`URI requested responds with an invalid redirect URL: ${locationHeader}`,
						DOMExceptionNameEnum.uriMismatchError
					)
				);
				return;
			}
		}

		switch (this.request.redirect) {
			case 'error':
				this.finalizeRequest();
				this.reject(
					new DOMException(
						`URI requested responds with a redirect, redirect mode is set to error: ${this.request.url}`,
						DOMExceptionNameEnum.uriMismatchError
					)
				);
				return;
			case 'manual':
				// Nothing to do
				break;
			case 'follow': {
				if (locationURL === null) {
					break;
				}

				if (this.redirectCount >= MAX_REDIRECT_COUNT) {
					this.finalizeRequest();
					this.reject(
						new DOMException(
							`Maximum redirect reached at: ${this.request.url}`,
							DOMExceptionNameEnum.networkError
						)
					);
					return;
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
					headers,
					body
				};

				// When following a redirect to another top domain or different protocol, unsafe headers will be ignored.
				if (
					(this.request._url.hostname !== locationURL.hostname &&
						!this.request._url.hostname.endsWith(locationURL.hostname)) ||
					this.request._url.protocol !== locationURL.protocol
				) {
					for (const name of UNSAFE_CORS_REDIRECT_HEADERS) {
						headers.delete(name);
					}
				}

				if (nodeResponse.statusCode !== 303 && this.request.body && !this.request._bodyBuffer) {
					this.finalizeRequest();
					this.reject(
						new DOMException(
							'Cannot follow redirect with body being a readable stream.',
							DOMExceptionNameEnum.networkError
						)
					);
					return;
				}

				if (
					nodeResponse.statusCode === 303 ||
					((nodeResponse.statusCode === 301 || nodeResponse.statusCode === 302) &&
						this.request.method === 'POST')
				) {
					requestInit.method = 'GET';
					requestInit.body = undefined;
					headers.delete('content-length');
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
					redirectCount: this.redirectCount + 1
				});

				this.finalizeRequest();
				this.resolve(fetch.send());
				return;
			}

			default:
				this.reject(
					new DOMException(
						`Redirect option '${this.request.redirect}' is not a valid value of RequestRedirect`
					)
				);
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
		const cookie = document.defaultView.document.cookie;

		headers.set('Accept-Encoding', 'gzip, deflate, br');
		headers.set('Connection', 'close');
		headers.set('User-Agent', document.defaultView.navigator.userAgent);

		if (this.request._referrer instanceof URL) {
			headers.set('Referer', this.request._referrer.href);
		}

		if (cookie) {
			headers.set('Cookie', cookie);
		}

		if (!headers.has('Accept')) {
			headers.set('Accept', '*/*');
		}

		if (this.request._contentLength !== null) {
			headers.set('Content-Length', String(this.request._contentLength));
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
					this.ownerDocument.cookie = header;
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
		this.nodeRequest.destroy();
		this.request.signal.removeEventListener('abort', this.listeners.onSignalAbort);
	}

	/**
	 * Aborts the request.
	 *
	 * @param [response] Response.
	 */
	private abort(response?: Response): void {
		const error = new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError);

		if (this.request.body) {
			this.request.body.destroy(error);
		}

		if (!response || !response.body) {
			if (this.reject) {
				this.reject(error);
			}
			return;
		}

		response.body.emit('error', error);

		if (this.reject) {
			this.reject(error);
		}
	}
}
