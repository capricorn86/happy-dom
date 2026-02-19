import Event from '../Event.js';
import IPromiseRejectionEventInit from './IPromiseRejectionEventInit.js';

/**
 * PromiseRejectionEvent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
 */
export default class PromiseRejectionEvent extends Event {
	public readonly promise: Promise<unknown>;
	public readonly reason: unknown;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IPromiseRejectionEventInit) {
		super(type, eventInit);

		this.promise = eventInit.promise;
		this.reason = eventInit.reason;
	}
}
