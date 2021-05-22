import UIEvent from '../UIEvent';
import IWheelEventInit from './IWheelEventInit';

/**
 *
 */
export default class WheelEvent extends UIEvent {
	public static DOM_DELTA_PIXEL = 0;
	public static DOM_DELTA_LINE = 1;
	public static DOM_DELTA_PAGE = 2;
	public readonly deltaX: number = 0;
	public readonly deltaY: number = 0;
	public readonly deltaZ: number = 0;
	public readonly deltaMode: number = 0;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IWheelEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.deltaX = eventInit.deltaX !== undefined ? eventInit.deltaX : 0;
			this.deltaY = eventInit.deltaY !== undefined ? eventInit.deltaY : 0;
			this.deltaZ = eventInit.deltaZ !== undefined ? eventInit.deltaZ : 0;
			this.deltaMode = eventInit.deltaMode !== undefined ? eventInit.deltaMode : 0;
		}
	}
}
