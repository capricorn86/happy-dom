import DataTransfer from '../DataTransfer';
import UIEvent from '../UIEvent';
import IInputEventInit from './IInputEventInit';

/**
 *
 */
export default class InputEvent extends UIEvent {
	public readonly data: string = '';
	public readonly dataTransfer: DataTransfer = null;
	public readonly inputType: string = '';
	public readonly isComposing: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IInputEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.data = eventInit.data || '';
			this.dataTransfer = eventInit.dataTransfer || null;
			this.inputType = eventInit.inputType || '';
			this.isComposing = eventInit.isComposing || false;
		}
	}
}
