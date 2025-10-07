import Event from '../Event.js';
import IPromiseRejectionEventInit from './IPromiseRejectionEventInit.js';

/**
 * Promise rejection event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
 */
export default class PromiseRejectionEvent extends Event {
	public readonly promise: Promise<any>;
	public readonly reason: any;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IPromiseRejectionEventInit | null = null) {
		super(type, eventInit);

		if (!eventInit?.promise) {
			throw new TypeError('PromiseRejectionEvent constructor requires a promise in eventInit');
		}

		this.promise = eventInit.promise;
		this.reason = eventInit.reason;
	}
}
