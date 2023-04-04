import IWindow from '../window/IWindow';
import Event from './Event';
import IUIEventInit from './IUIEventInit';

/**
 *
 */
export default class UIEvent extends Event {
	public static NONE = 0;
	public static CAPTURING_PHASE = 1;
	public static AT_TARGET = 2;
	public static BUBBLING_PHASE = 3;
	public readonly detail: number = 0;
	public readonly layerX: number = 0;
	public readonly layerY: number = 0;
	public readonly pageX: number = 0;
	public readonly pageY: number = 0;
	public readonly view: IWindow = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IUIEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.detail = eventInit.detail !== undefined ? eventInit.detail : 0;
			this.view = eventInit.view || null;
		}
	}
}
