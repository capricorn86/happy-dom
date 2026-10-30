import EventTarget from '../event/EventTarget.js';
import MessageEvent from '../event/events/MessageEvent.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';

// Open channels grouped by scope, then by origin and channel name. The scope is the browser
// context, so channels in different browsers or contexts can't reach each other. Windows with an
// opaque origin (e.g. "about:blank") are their own scope, as an opaque origin only matches itself.
const OPEN_CHANNELS: WeakMap<object, Map<string, Set<BroadcastChannel>>> = new WeakMap();

/**
 * Broadcast channel.
 *
 * @see https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 */
export default class BroadcastChannel extends EventTarget {
	// Internal properties
	public [PropertySymbol.propertyEventListeners]: Map<
		string,
		((event: MessageEvent) => void) | null
	> = new Map();

	#name: string;
	#closed = false;
	#channelsByKey: Map<string, Set<BroadcastChannel>> | null = null;
	#key = '';

	/**
	 * Constructor.
	 *
	 * @param name Channel name.
	 */
	constructor(name: string) {
		super();

		const window = this[PropertySymbol.window];

		if (arguments.length === 0) {
			throw new window.TypeError(
				`Failed to construct 'BroadcastChannel': 1 argument required, but only 0 present.`
			);
		}

		this.#name = String(name);

		if (window.closed) {
			this.#closed = true;
			return;
		}

		const origin = window.location.origin;
		const scope =
			origin === 'null' ? window : new WindowBrowserContext(window).getBrowserContext() || window;
		let channelsByKey = OPEN_CHANNELS.get(scope);

		if (!channelsByKey) {
			channelsByKey = new Map();
			OPEN_CHANNELS.set(scope, channelsByKey);
		}

		this.#channelsByKey = channelsByKey;
		this.#key = `${origin} ${this.#name}`;

		let channels = channelsByKey.get(this.#key);

		if (!channels) {
			channels = new Set();
			channelsByKey.set(this.#key, channels);
		}

		channels.add(this);
		window[PropertySymbol.openBroadcastChannels].add(this);
	}

	/**
	 * Returns the channel name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.#name;
	}

	/* eslint-disable jsdoc/require-jsdoc */

	public get onmessage(): ((event: MessageEvent) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmessage') ?? null;
	}

	public set onmessage(value: ((event: MessageEvent) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmessage', value);
	}

	public get onmessageerror(): ((event: MessageEvent) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmessageerror') ?? null;
	}

	public set onmessageerror(value: ((event: MessageEvent) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmessageerror', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Sends a message to all other channels with the same name and origin.
	 *
	 * @param message Message.
	 */
	public postMessage(message: unknown): void {
		const window = this[PropertySymbol.window];

		if (arguments.length === 0) {
			throw new window.TypeError(
				`Failed to execute 'postMessage' on 'BroadcastChannel': 1 argument required, but only 0 present.`
			);
		}

		if (this.#closed) {
			throw new window.DOMException(
				`Failed to execute 'postMessage' on 'BroadcastChannel': Channel is closed`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		let serialized: unknown;

		try {
			serialized = structuredClone(message);
		} catch (error) {
			throw new window.DOMException(
				`Failed to execute 'postMessage' on 'BroadcastChannel': ${(<Error>error).message}`,
				DOMExceptionNameEnum.dataCloneError
			);
		}

		const origin = window.location.origin;

		for (const channel of this.#channelsByKey!.get(this.#key)!) {
			if (channel !== this) {
				channel.#queueMessage(serialized, origin);
			}
		}
	}

	/**
	 * Closes the channel, so it no longer sends or receives messages.
	 */
	public close(): void {
		if (this.#closed) {
			return;
		}

		this.#closed = true;

		const channels = this.#channelsByKey!.get(this.#key)!;

		channels.delete(this);

		if (!channels.size) {
			this.#channelsByKey!.delete(this.#key);
		}

		this[PropertySymbol.window][PropertySymbol.openBroadcastChannels].delete(this);
	}

	/**
	 * Destroys the channel.
	 */
	public override [PropertySymbol.destroy](): void {
		super[PropertySymbol.destroy]();
		this.close();
	}

	/**
	 * Queues a message for this channel in its own window.
	 *
	 * Each receiver gets its own copy of the message. Nothing is delivered after the channel or its
	 * window has been closed.
	 *
	 * @param serialized Serialized message.
	 * @param origin Origin of the sender.
	 */
	#queueMessage(serialized: unknown, origin: string): void {
		this[PropertySymbol.window].setTimeout(() => {
			if (this.#closed) {
				return;
			}

			let data: unknown;

			try {
				data = structuredClone(serialized);
			} catch {
				this.dispatchEvent(new MessageEvent('messageerror', { origin }));
				return;
			}

			this.dispatchEvent(new MessageEvent('message', { data, origin }));
		});
	}
}
