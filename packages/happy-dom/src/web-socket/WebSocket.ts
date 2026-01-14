import CookieStringUtility from '../cookie/urilities/CookieStringUtility.js';
import EventTarget from '../event/EventTarget.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import WebSocketReadyStateEnum from './WebSocketReadyStateEnum.js';
import Blob from '../file/Blob.js';
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
	public static readonly CONNECTING: number = WebSocketReadyStateEnum.connecting;
	public static readonly OPEN: number = WebSocketReadyStateEnum.open;
	public static readonly CLOSING: number = WebSocketReadyStateEnum.closing;
	public static readonly CLOSED: number = WebSocketReadyStateEnum.closed;

	#readyState: WebSocketReadyStateEnum = WebSocketReadyStateEnum.closed;
	#extensions: string = '';
	#binaryType: 'blob' | 'arraybuffer' = 'blob';
	#error: Error | null = null;
	#url: URL;

	public [PropertySymbol.webSocket]: WS | null = null;

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

		this.#url = parsedURL;

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
	public get binaryType(): 'blob' | 'arraybuffer' {
		return this.#binaryType;
	}

	/**
	 * Sets the binary type.
	 *
	 * @param value The binary type.
	 */
	public set binaryType(value: 'blob' | 'arraybuffer') {
		if (value !== 'blob' && value !== 'arraybuffer') {
			return;
		}
		this.#binaryType = value;
	}

	/**
	 * Returns protocol.
	 */
	public get protocol(): string {
		return this[PropertySymbol.webSocket]?.protocol || '';
	}

	/**
	 * Returns the URL.
	 *
	 * @returns The URL.
	 */
	public get url(): string {
		return this.#url.href;
	}

	/**
	 * Closes the WebSocket.
	 *
	 * @param [code] Code.
	 * @param [reason] Reason.
	 */
	public close(code?: number, reason?: string | Buffer<ArrayBufferLike>): void {
		const window = this[PropertySymbol.window];

		if (code !== undefined && code !== 1000 && !(code >= 3000 && code <= 4999)) {
			throw new window.DOMException(
				`The code must be either 1000, or between 3000 and 4999. ${code} is neither.`,
				DOMExceptionNameEnum.invalidAccessError
			);
		}
		if (reason !== undefined && Buffer.byteLength(reason, 'utf8') > 123) {
			throw new window.DOMException(
				`The message must not be greater than 123 bytes.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		this.#close(code, reason ? Buffer.from(<string>reason) : undefined);
	}

	/**
	 * Sends data through the WebSocket.
	 *
	 * @param data Data.
	 */
	public send(data: ArrayBuffer | ArrayBufferView | Blob | Buffer | string): void {
		const window = this[PropertySymbol.window];

		if (this.#readyState === WebSocketReadyStateEnum.connecting) {
			throw new window.DOMException(
				'Still in CONNECTING state.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		if (this.#readyState !== WebSocketReadyStateEnum.open) {
			return;
		}

		if (typeof data === 'string') {
			this[PropertySymbol.webSocket]?.send(data, { binary: false });
			return;
		}

		let buffer: Buffer;

		if (data instanceof ArrayBuffer) {
			buffer = Buffer.from(new Uint8Array(data));
		} else if (data instanceof Blob) {
			buffer = data[PropertySymbol.buffer];
		} else if (data instanceof Buffer) {
			buffer = data;
		} else if (ArrayBuffer.isView(data)) {
			buffer = Buffer.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
		} else {
			buffer = Buffer.from(String(data));
		}

		this[PropertySymbol.webSocket]?.send(buffer, { binary: true });
	}

	/**
	 * Destroys the WebSocket.
	 */
	public override [PropertySymbol.destroy](): void {
		super[PropertySymbol.destroy]();
		this.#close(1001);
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

		this[PropertySymbol.webSocket] = new WS(url, protocols, {
			headers: {
				'user-agent': window.navigator.userAgent,
				cookie: CookieStringUtility.cookiesToString(cookies),
				origin: originURL.origin
			},
			rejectUnauthorized: !browserContext.browser.settings.fetch.disableStrictSSL
		});
		this[PropertySymbol.webSocket].once('open', () => {
			this.#onConnectionEstablished();
		});
		this[PropertySymbol.webSocket].on('message', this.#onMessageReceived.bind(this));
		this[PropertySymbol.webSocket].once(
			'close',
			(code: number, reason: Buffer<ArrayBufferLike>) => {
				this.#onConnectionClosed(code, reason);
			}
		);
		this[PropertySymbol.webSocket].once('upgrade', ({ headers }) => {
			if (headers['set-cookie'] !== undefined) {
				const cookieStrings = Array.isArray(headers['set-cookie'])
					? headers['set-cookie']
					: [headers['set-cookie']];
				for (const cookieString of cookieStrings) {
					const cookie = CookieStringUtility.stringToCookie(originURL, cookieString);
					if (cookie) {
						browserContext.cookieContainer.addCookies([cookie]);
					}
				}
			}
		});
		this[PropertySymbol.webSocket].once('error', (error: Error) => {
			// We only need to store the error for debugging purposes and to know that it wasn't a clean close.
			// The 'close' event will be emitted afterwards.
			this.#error = error;
		});
		window[PropertySymbol.openWebSockets].push(this);
	}

	/**
	 * Closes the WebSocket connection.
	 *
	 * @param code Code.
	 * @param reason Reason.
	 */
	#close(code?: number, reason?: string | Buffer<ArrayBufferLike>): void {
		if (this.readyState === WebSocketReadyStateEnum.connecting) {
			if (this[PropertySymbol.webSocket]) {
				this[PropertySymbol.webSocket].terminate();
			} else {
				this.#readyState = WebSocketReadyStateEnum.closing;
			}
		} else if (this[PropertySymbol.webSocket] && this.readyState === WebSocketReadyStateEnum.open) {
			this[PropertySymbol.webSocket].close(code, reason);
		}
		this[PropertySymbol.webSocket] = null;
	}

	/**
	 * Called when the connection has been established.
	 *
	 * @see https://html.spec.whatwg.org/multipage/web-sockets.html#feedback-from-the-protocol
	 */
	#onConnectionEstablished(): void {
		if (this[PropertySymbol.webSocket]?.extensions) {
			this.#extensions = Object.keys(this[PropertySymbol.webSocket]!.extensions).join(', ');
		}
		this.#readyState = WebSocketReadyStateEnum.open;
		this.dispatchEvent(new this[PropertySymbol.window].Event('open'));
	}

	/**
	 * Called when the connection has been closed.
	 *
	 * @param code Code.
	 * @param reason Reason.
	 */
	#onConnectionClosed(code: number, reason: Buffer<ArrayBufferLike>): void {
		const window = this[PropertySymbol.window];
		const index = window[PropertySymbol.openWebSockets].indexOf(this);

		if (index !== -1) {
			window[PropertySymbol.openWebSockets].splice(index, 1);
		}

		this.#readyState = WebSocketReadyStateEnum.closed;

		this.dispatchEvent(
			new this[PropertySymbol.window].CloseEvent('close', {
				wasClean: this.#error === null,
				code,
				reason: reason.toString()
			})
		);
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

		const window = this[PropertySymbol.window];
		let dataForEvent;

		if (isBinary) {
			switch (this.binaryType) {
				case 'arraybuffer':
					if (data instanceof window.ArrayBuffer) {
						dataForEvent = data;
					} else if (Array.isArray(data)) {
						dataForEvent = this.#convertToArrayBuffer(Buffer.concat(data));
					} else {
						dataForEvent = this.#convertToArrayBuffer(data);
					}
					break;
				case 'blob':
				default:
					if (!Array.isArray(data)) {
						data = [data];
					}
					dataForEvent = new window.Blob(data);
					break;
			}
		} else {
			dataForEvent = String(data);
		}

		this.dispatchEvent(
			new window.MessageEvent('message', {
				data: dataForEvent,
				origin: this.#url.origin
			})
		);
	}

	/**
	 * Converts a Node.js Buffer to an ArrayBuffer.
	 *
	 * @param buffer Node.js Buffer.
	 * @returns ArrayBuffer.
	 */
	#convertToArrayBuffer(buffer: Buffer): ArrayBuffer {
		const window = this[PropertySymbol.window];
		const arrayBuffer = new window.ArrayBuffer(buffer.byteLength);
		const view = new Uint8Array(arrayBuffer);
		view.set(buffer);
		return arrayBuffer;
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
