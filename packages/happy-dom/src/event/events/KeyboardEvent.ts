import UIEvent from '../UIEvent';
import IKeyboardEventInit from './IKeyboardEventInit';

/**
 *
 */
export default class KeyboardEvent extends UIEvent {
	public static DOM_KEY_LOCATION_STANDARD = 0;
	public static DOM_KEY_LOCATION_LEFT = 1;
	public static DOM_KEY_LOCATION_RIGHT = 2;
	public static DOM_KEY_LOCATION_NUMPAD = 3;
	public readonly altKey: boolean = false;
	public readonly code: string = '';
	public readonly ctrlKey: boolean = false;
	public readonly isComposing: boolean = false;
	public readonly key: string = '';
	public readonly location: number = 0;
	public readonly metaKey: boolean = false;
	public readonly repeat: boolean = false;
	public readonly shiftKey: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IKeyboardEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.altKey = eventInit.altKey || false;
			this.code = eventInit.code || '';
			this.ctrlKey = eventInit.ctrlKey || false;
			this.isComposing = eventInit.isComposing || false;
			this.key = eventInit.key || '';
			this.location = eventInit.location !== undefined ? eventInit.location : 0;
			this.metaKey = eventInit.metaKey || false;
			this.repeat = eventInit.repeat || false;
			this.shiftKey = eventInit.shiftKey || false;
		}
	}
}
