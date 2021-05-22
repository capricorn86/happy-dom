import UIEvent from '../UIEvent';
import IErrorEventInit from './IErrorEventInit';

/**
 *
 */
export default class ErrorEvent extends UIEvent {
	public readonly message: string = '';
	public readonly filename: string = '';
	public readonly lineno: number = 0;
	public readonly colno: number = 0;
	public readonly error: object = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IErrorEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.message = eventInit.message || '';
			this.filename = eventInit.filename || '';
			this.lineno = eventInit.lineno !== undefined ? eventInit.lineno : 0;
			this.colno = eventInit.colno !== undefined ? eventInit.colno : 0;
			this.error = eventInit.error || null;
		}
	}
}
