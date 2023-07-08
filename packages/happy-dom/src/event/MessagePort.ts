import EventTarget from './EventTarget.js';
import IMessagePort from './IMessagePort.js';

/**
 * Message port.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
 */
export default abstract class MessagePort extends EventTarget implements IMessagePort {
	/**
	 * Sends a message from the port, and optionally, transfers ownership of objects to other browsing contexts.
	 *
	 * @param _message Message.
	 * @param _transerList Transfer list.
	 */
	public postMessage(_message: unknown, _transerList: unknown[]): void {
		// TODO: Implement
	}

	/**
	 * Starts the sending of messages queued on the port.
	 */
	public start(): void {
		// TODO: Implement
	}

	/**
	 * Disconnects the port, so it is no longer active. This stops the flow of messages to that port.
	 */
	public close(): void {
		// TODO: Implement
	}
}
