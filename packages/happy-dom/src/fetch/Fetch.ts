import IRequestInit from './IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './IResponse';
import Request from './Request';
import IRequestInfo from './IRequestInfo';
import { URL } from 'url';
import Headers from './Headers';
import IRequest from './IRequest';

/**
 * Helper class for performing fetch.
 */
export default class Fetch {
	private url: IRequestInfo;
	private init?: IRequestInit;
	private ownerDocument: IDocument;
	private request: Request;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.document
	 * @param options.url URL.
	 * @param [options.init] Init.
	 * @param options.ownerDocument
	 */
	constructor(options: { ownerDocument: IDocument; url: IRequestInfo; init?: IRequestInit }) {
		const init = { ...options.init, headers: new Headers(options.init?.headers) };
		const url = options.url;

		this.url = url;
		this.init = init;
		this.ownerDocument = options.ownerDocument;
		this.request = typeof url === 'string' || url instanceof URL ? new Request(url, init) : url;
	}

	/**
	 * Sends request.
	 *
	 * @returns Response.
	 */
	public send(): Promise<IResponse> {
		return new Promise((resolve, reject) => {
			if (!this.request.referrerPolicy) {
				(<string>this.request.referrerPolicy) = 'strict-origin-when-cross-origin';
			}

			// Build request object
			const { parsedURL, options } = getNodeRequestOptions(request);
			if (!supportedSchemas.has(parsedURL.protocol)) {
				throw new TypeError(
					`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(
						/:$/,
						''
					)}" is not supported.`
				);
			}

			if (parsedURL.protocol === 'data:') {
				const data = dataUriToBuffer(request.url);
				const response = new Response(data, {
					headers: { 'Content-Type': data.typeFull }
				});
				resolve(response);
				return;
			}

			// Wrap http.request into fetch
			const send = (parsedURL.protocol === 'https:' ? https : http).request;
			const { signal } = request;
			let response = null;

			const abort = () => {
				const error = new AbortError('The operation was aborted.');
				reject(error);
				if (request.body && request.body instanceof Stream.Readable) {
					request.body.destroy(error);
				}

				if (!response || !response.body) {
					return;
				}

				response.body.emit('error', error);
			};

			if (signal && signal.aborted) {
				abort();
				return;
			}

			const abortAndFinalize = () => {
				abort();
				finalize();
			};

			// Send request
			const request_ = send(parsedURL.toString(), options);

			if (signal) {
				signal.addEventListener('abort', abortAndFinalize);
			}

			const finalize = () => {
				request_.abort();
				if (signal) {
					signal.removeEventListener('abort', abortAndFinalize);
				}
			};

			request_.on('error', (error) => {
				reject(
					new FetchError(
						`request to ${request.url} failed, reason: ${error.message}`,
						'system',
						error
					)
				);
				finalize();
			});

			fixResponseChunkedTransferBadEnding(request_, (error) => {
				if (response && response.body) {
					response.body.destroy(error);
				}
			});

			/* C8 ignore next 18 */
			if (process.version < 'v14') {
				// Before Node.js 14, pipeline() does not fully support async iterators and does not always
				// Properly handle when the socket close/end events are out of order.
				request_.on('socket', (s) => {
					let endedWithEventsCount;
					s.prependListener('end', () => {
						endedWithEventsCount = s._eventsCount;
					});
					s.prependListener('close', (hadError) => {
						// If end happened before close but the socket didn't emit an error, do it now
						if (response && endedWithEventsCount < s._eventsCount && !hadError) {
							const error = new Error('Premature close');
							error.code = 'ERR_STREAM_PREMATURE_CLOSE';
							response.body.emit('error', error);
						}
					});
				});
			}

			request_.on('response', (response_) => {
				request_.setTimeout(0);
				const headers = fromRawHeaders(response_.rawHeaders);

				// HTTP fetch step 5
				if (isRedirect(response_.statusCode)) {
					// HTTP fetch step 5.2
					const location = headers.get('Location');

					// HTTP fetch step 5.3
					let locationURL = null;
					try {
						locationURL = location === null ? null : new URL(location, request.url);
					} catch {
						// Error here can only be invalid URL in Location: header
						// Do not throw when options.redirect == manual
						// Let the user extract the errorneous redirect URL
						if (request.redirect !== 'manual') {
							reject(
								new FetchError(
									`uri requested responds with an invalid redirect URL: ${location}`,
									'invalid-redirect'
								)
							);
							finalize();
							return;
						}
					}

					// HTTP fetch step 5.5
					switch (request.redirect) {
						case 'error':
							reject(
								new FetchError(
									`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`,
									'no-redirect'
								)
							);
							finalize();
							return;
						case 'manual':
							// Nothing to do
							break;
						case 'follow': {
							// HTTP-redirect fetch step 2
							if (locationURL === null) {
								break;
							}

							// HTTP-redirect fetch step 5
							if (request.counter >= request.follow) {
								reject(
									new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect')
								);
								finalize();
								return;
							}

							// HTTP-redirect fetch step 6 (counter increment)
							// Create a new Request object.
							const requestOptions = {
								headers: new Headers(request.headers),
								follow: request.follow,
								counter: request.counter + 1,
								agent: request.agent,
								compress: request.compress,
								method: request.method,
								body: clone(request),
								signal: request.signal,
								size: request.size,
								referrer: request.referrer,
								referrerPolicy: request.referrerPolicy
							};

							// When forwarding sensitive headers like "Authorization",
							// "WWW-Authenticate", and "Cookie" to untrusted targets,
							// Headers will be ignored when following a redirect to a domain
							// That is not a subdomain match or exact match of the initial domain.
							// For example, a redirect from "foo.com" to either "foo.com" or "sub.foo.com"
							// Will forward the sensitive headers, but a redirect to "bar.com" will not.
							// Headers will also be ignored when following a redirect to a domain using
							// A different protocol. For example, a redirect from "https://foo.com" to "http://foo.com"
							// Will not forward the sensitive headers
							if (
								!isDomainOrSubdomain(request.url, locationURL) ||
								!isSameProtocol(request.url, locationURL)
							) {
								for (const name of ['authorization', 'www-authenticate', 'cookie', 'cookie2']) {
									requestOptions.headers.delete(name);
								}
							}

							// HTTP-redirect fetch step 9
							if (
								response_.statusCode !== 303 &&
								request.body &&
								options_.body instanceof Stream.Readable
							) {
								reject(
									new FetchError(
										'Cannot follow redirect with body being a readable stream',
										'unsupported-redirect'
									)
								);
								finalize();
								return;
							}

							// HTTP-redirect fetch step 11
							if (
								response_.statusCode === 303 ||
								((response_.statusCode === 301 || response_.statusCode === 302) &&
									request.method === 'POST')
							) {
								requestOptions.method = 'GET';
								requestOptions.body = undefined;
								requestOptions.headers.delete('content-length');
							}

							// HTTP-redirect fetch step 14
							const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
							if (responseReferrerPolicy) {
								requestOptions.referrerPolicy = responseReferrerPolicy;
							}

							// HTTP-redirect fetch step 15
							resolve(fetch(new Request(locationURL, requestOptions)));
							finalize();
							return;
						}

						default:
							return reject(
								new TypeError(
									`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`
								)
							);
					}
				}

				// Prepare response
				if (signal) {
					response_.once('end', () => {
						signal.removeEventListener('abort', abortAndFinalize);
					});
				}

				let body = pump(response_, new PassThrough(), (error) => {
					if (error) {
						reject(error);
					}
				});
				// See https://github.com/nodejs/node/pull/29376
				/* C8 ignore next 3 */
				if (process.version < 'v12.10') {
					response_.on('aborted', abortAndFinalize);
				}

				const responseOptions = {
					url: request.url,
					status: response_.statusCode,
					statusText: response_.statusMessage,
					headers,
					size: request.size,
					counter: request.counter,
					highWaterMark: request.highWaterMark
				};

				// HTTP-network fetch step 12.1.1.3
				const codings = headers.get('Content-Encoding');

				// HTTP-network fetch step 12.1.1.4: handle content codings

				// In following scenarios we ignore compression support
				// 1. compression support is disabled
				// 2. HEAD request
				// 3. no Content-Encoding header
				// 4. no content response (204)
				// 5. content not modified response (304)
				if (
					!request.compress ||
					request.method === 'HEAD' ||
					codings === null ||
					response_.statusCode === 204 ||
					response_.statusCode === 304
				) {
					response = new Response(body, responseOptions);
					resolve(response);
					return;
				}

				// For Node v6+
				// Be less strict when decoding compressed responses, since sometimes
				// Servers send slightly invalid responses that are still accepted
				// By common browsers.
				// Always using Z_SYNC_FLUSH is what cURL does.
				const zlibOptions = {
					flush: zlib.Z_SYNC_FLUSH,
					finishFlush: zlib.Z_SYNC_FLUSH
				};

				// For gzip
				if (codings === 'gzip' || codings === 'x-gzip') {
					body = pump(body, zlib.createGunzip(zlibOptions), (error) => {
						if (error) {
							reject(error);
						}
					});
					response = new Response(body, responseOptions);
					resolve(response);
					return;
				}

				// For deflate
				if (codings === 'deflate' || codings === 'x-deflate') {
					// Handle the infamous raw deflate response from old servers
					// A hack for old IIS and Apache servers
					const raw = pump(response_, new PassThrough(), (error) => {
						if (error) {
							reject(error);
						}
					});
					raw.once('data', (chunk) => {
						// See http://stackoverflow.com/questions/37519828
						if ((chunk[0] & 0x0f) === 0x08) {
							body = pump(body, zlib.createInflate(), (error) => {
								if (error) {
									reject(error);
								}
							});
						} else {
							body = pump(body, zlib.createInflateRaw(), (error) => {
								if (error) {
									reject(error);
								}
							});
						}

						response = new Response(body, responseOptions);
						resolve(response);
					});
					raw.once('end', () => {
						// Some old IIS servers return zero-length OK deflate responses, so
						// 'data' is never emitted. See https://github.com/node-fetch/node-fetch/pull/903
						if (!response) {
							response = new Response(body, responseOptions);
							resolve(response);
						}
					});
					return;
				}

				// For br
				if (codings === 'br') {
					body = pump(body, zlib.createBrotliDecompress(), (error) => {
						if (error) {
							reject(error);
						}
					});
					response = new Response(body, responseOptions);
					resolve(response);
					return;
				}

				// Otherwise, use response as-is
				response = new Response(body, responseOptions);
				resolve(response);
			});

			// eslint-disable-next-line promise/prefer-await-to-then
			writeToStream(request_, request).catch(reject);
		});
	}

	/**
	 * Returns request headers.
	 *
	 * @returns Headers.
	 */
	private getHeaders(): Headers {
		const headers = new Headers(this.request.headers);
		const document = this.ownerDocument;
		const cookie = document.defaultView.document.cookie;

		headers.set('User-Agent', document.defaultView.navigator.userAgent);

		// Referrer can be a URL with the same origin as the page or "about:client".
		// When it's "about:client", we should set it do the origin of the page.
		if (this.request.referrer === 'about:client') {
			// Origin is "null" when the URL is set to "about:blank" (this is also how the browser behaves).
			// Then we don't know the real referer, so we don't set it.
			if (document.defaultView.location.origin !== 'null') {
				headers.set(
					'referer',
					document.defaultView.location.origin +
						document.defaultView.location.pathname +
						document.defaultView.location.search
				);
			}
		} else {
			headers.set('Referer', this.request.referrer);
		}

		if (cookie) {
			headers.set('Set-Cookie', cookie);
		} else {
			// For security reasons the cookie header should not be set by the consumer.
			headers.delete('Set-Cookie');
		}

		if (!headers.has('Accept')) {
			headers.set('Accept', '*/*');
		}

		// TODO: Is this correct? "node-fetch" has a compress option that is not available by default.
		if (!headers.has('Accept-Encoding')) {
			headers.set('accept-encoding', 'gzip, deflate, br');
		}

		if (this.request._contentLength !== null) {
			headers.set('Content-Length', String(this.request._contentLength));
		}

		if (!headers.has('Connection')) {
			headers.set('Connection', 'close');
		}

		return headers;
	}
}
