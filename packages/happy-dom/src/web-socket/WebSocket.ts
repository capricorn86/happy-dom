import CookieStringUtility from '../cookie/urilities/CookieStringUtility.js';
import EventTarget from '../event/EventTarget.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import WebSocketReadyStateEnum from './WebSocketReadyStateEnum.js';
import WS from 'ws';

// https://tools.ietf.org/html/rfc7230#section-3.2.6
const SECURE_PROTOCOL_REGEXP = /^[!#$%&'*+\-.^_`|~\dA-Za-z]+$/;

/**
 * Represents a WebSocket.
 *
 * Based on:
 * https://github.com/jsdom/jsdom/blob/main/lib/jsdom/living/websockets/WebSocket-impl.js
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 */
export default class WebSocket extends EventTarget {
	#readyState: WebSocketReadyStateEnum = WebSocketReadyStateEnum.closed;
	#extensions: string = '';
	#webSocket: WS | null = null;
	#binaryType: 'blob' | 'arraybuffer' = 'blob';

	/**
	 *
	 * @param url
	 * @param protocols
	 */
	constructor(url: string, protocols?: string | string[]) {
		super();

		const window = this[PropertySymbol.window];

		let parsedURL: URL;
		try {
			parsedURL = new URL(url);
		} catch {
			throw new window.DOMException(
				`The URL '${url}' is invalid.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		if (parsedURL.protocol !== 'ws:' && parsedURL.protocol !== 'wss:') {
			throw new window.DOMException(
				`The URL's protocol must be either 'ws' or 'wss'. '${parsedURL.protocol}' is not allowed.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		if (parsedURL.pathname.length > 1) {
			throw new window.DOMException(
				`The URL contains a path name ('${parsedURL.pathname}'). Paths are not allowed in WebSocket URLs.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		const protocolSet = new Set<string>();
		const protocolList: string[] =
			protocols !== undefined ? (Array.isArray(protocols) ? protocols : [protocols]) : [];

		for (const protocol of protocolList) {
			if (!this.#validateSecureProtocol(protocol)) {
				throw new window.DOMException(
					`The subprotocol '${protocol}' is invalid.`,
					DOMExceptionNameEnum.syntaxError
				);
			}

			if (protocolSet.has(protocol)) {
				throw new window.DOMException(
					`The subprotocol '${protocol}' is duplicated.`,
					DOMExceptionNameEnum.syntaxError
				);
			}

			protocolSet.add(protocol);
		}

		this.#connect(parsedURL, protocolList);
	}

	/**
	 * Returns the ready state.
	 *
	 * @returns The ready state.
	 */
	public get readyState(): number {
		return this.#readyState;
	}

	/**
	 * Returns the extensions.
	 *
	 * @returns The extensions.
	 */
	public get extensions(): string {
		return this.#extensions;
	}

	/**
	 * Returns the binary type.
	 *
	 * @returns The binary type.
	 */
	public get binaryType(): string {
		return this.#binaryType;
	}

	/**
	 * Connects the WebSocket.
	 *
	 * @param url URL.
	 * @param protocols Protocols.
	 */
	#connect(url: URL, protocols: string[]): void {
		const window = this[PropertySymbol.window];
		const browserContext = new WindowBrowserContext(window).getBrowserContext();
		if (!browserContext) {
			return;
		}
		const originURL = new URL(window.location.href);
		const cookies = browserContext.cookieContainer.getCookies(originURL, false);

		this.#readyState = WebSocketReadyStateEnum.connecting;

		this.#webSocket = new WS(url, protocols, {
			headers: {
				'user-agent': window.navigator.userAgent,
				cookie: CookieStringUtility.cookiesToString(cookies),
				origin: originURL.origin
			},
			rejectUnauthorized: !browserContext.browser.settings.fetch.disableStrictSSL
		});
		this.#webSocket.once('open', () => {
			this.#onConnectionEstablished();
		});
		this.#webSocket.on('message', this.#onMessageReceived.bind(this));
		this.#webSocket.once('close', (...closeArgs) => {
			this.#onConnectionClosed(...closeArgs);
		});
		this.#webSocket.once('upgrade', ({ headers }) => {
			if (Array.isArray(headers['set-cookie'])) {
				for (const cookie of headers['set-cookie']) {
					this._ownerDocument._cookieJar.setCookieSync(cookie, nodeParsedURL, {
						http: true,
						ignoreError: true
					});
				}
			} else if (headers['set-cookie'] !== undefined) {
				this._ownerDocument._cookieJar.setCookieSync(headers['set-cookie'], nodeParsedURL, {
					http: true,
					ignoreError: true
				});
			}
		});
		this.#webSocket.once('error', () => {
			// The exact error is passed into this callback, but it is ignored as we don't really care about it.
		});
	}

	/**
	 * Called when the connection has been established.
	 *
	 * @see https://html.spec.whatwg.org/multipage/web-sockets.html#feedback-from-the-protocol
	 */
	#onConnectionEstablished(): void {
		if (this.#webSocket!.extensions) {
			this.#extensions = Object.keys(this.#webSocket.extensions).join(', ');
		}
		this.#readyState = WebSocketReadyStateEnum.open;
		this.dispatchEvent(new this[PropertySymbol.window].Event('open'));
	}

	/**
	 * Called when a message has been received.
	 *
	 * @param data Data.
	 * @param isBinary "true" if the data is binary.
	 */
	#onMessageReceived(data: any, isBinary: boolean): void {
		if (this.#readyState !== WebSocketReadyStateEnum.open) {
			return;
		}
		let dataForEvent;
		if (!isBinary) {
			dataForEvent = data.toString();
		} else if (this.binaryType === 'arraybuffer') {
			if (isArrayBuffer(data)) {
				dataForEvent = data;
			} else if (Array.isArray(data)) {
				dataForEvent = copyToArrayBufferInNewRealm(Buffer.concat(data), this._globalObject);
			} else {
				dataForEvent = copyToArrayBufferInNewRealm(data, this._globalObject);
			}
		} else {
			// this.binaryType === "blob"
			if (!Array.isArray(data)) {
				data = [data];
			}
			dataForEvent = Blob.create(this._globalObject, [data, { type: '' }]);
		}
		fireAnEvent('message', this, MessageEvent, {
			data: dataForEvent,
			origin: serializeURLOrigin(this._urlRecord)
		});
	}

	/**
	 * See Sec-WebSocket-Protocol-Client, which is for the syntax of an entire header value. This function checks if a single header conforms to the rules.
	 *
	 * @see https://tools.ietf.org/html/rfc6455#section-4.3
	 * @param protocol
	 */
	#validateSecureProtocol(protocol: string): boolean {
		return SECURE_PROTOCOL_REGEXP.test(protocol);
	}
}
