import IEventTarget from './IEventTarget.js';

/**
 * Message port.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
 */
export default interface IMessagePort extends IEventTarget {
	/**
	 * Sends a message from the port, and optionally, transfers ownership of objects to other browsing contexts.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	postMessage(message: unknown, transerList: unknown[]): void;

	/**
	 * Starts the sending of messages queued on the port.
	 */
	start(): void;

	/**
	 * Disconnects the port, so it is no longer active. This stops the flow of messages to that port.
	 */
	close(): void;
}
