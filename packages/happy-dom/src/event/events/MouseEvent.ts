import UIEvent from '../UIEvent';
import EventTarget from '../EventTarget';
import IMouseEventInit from './IMouseEventInit';

/**
 *
 */
export default class MouseEvent extends UIEvent {
	public readonly altKey: boolean = false;
	public readonly button: number = 0;
	public readonly buttons: number = 0;
	public readonly clientX: number = 0;
	public readonly clientY: number = 0;
	public readonly ctrlKey: boolean = false;
	public readonly metaKey: boolean = false;
	public readonly movementX: number = 0;
	public readonly movementY: number = 0;
	public readonly offsetX: number = 0;
	public readonly offsetY: number = 0;
	public readonly region: string = '';
	public readonly relatedTarget: EventTarget = null;
	public readonly screenX: number = 0;
	public readonly screenY: number = 0;
	public readonly shiftKey: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IMouseEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.altKey = eventInit.altKey || false;
			this.button = eventInit.button !== undefined ? eventInit.button : 0;
			this.buttons = eventInit.buttons !== undefined ? eventInit.buttons : 0;
			this.clientX = eventInit.clientX !== undefined ? eventInit.clientX : 0;
			this.clientY = eventInit.clientY !== undefined ? eventInit.clientY : 0;
			this.ctrlKey = eventInit.ctrlKey || false;
			this.metaKey = eventInit.metaKey || false;
			this.region = eventInit.region || '';
			this.relatedTarget = eventInit.relatedTarget || null;
			this.screenX = eventInit.screenX !== undefined ? eventInit.screenX : 0;
			this.screenY = eventInit.screenY !== undefined ? eventInit.screenY : 0;
			this.shiftKey = eventInit.shiftKey || false;
		}
	}
}
