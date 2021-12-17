import MouseEvent from './MouseEvent';
import IPointerEventInit from './IPointerEventInit';

/**
 *
 */
export default class PointerEvent extends MouseEvent {
	public readonly pointerId: number = 0;
	public readonly width: number = 0;
	public readonly height: number = 0;
	public readonly pressure: number = 0;
	public readonly tangentialPressure: number = 0;
	public readonly tiltX: number = 0;
	public readonly tiltY: number = 0;
	public readonly twist: number = 0;
	public readonly pointerType: string = '';
	public readonly isPrimary: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IPointerEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.pointerId = eventInit.pointerId !== undefined ? eventInit.pointerId : 0;
			this.width = eventInit.width !== undefined ? eventInit.width : 0;
			this.height = eventInit.height !== undefined ? eventInit.height : 0;
			this.pressure = eventInit.pressure !== undefined ? eventInit.pressure : 0;
			this.tangentialPressure =
				eventInit.tangentialPressure !== undefined ? eventInit.tangentialPressure : 0;
			this.tiltX = eventInit.tiltX !== undefined ? eventInit.tiltX : 0;
			this.tiltY = eventInit.tiltY !== undefined ? eventInit.tiltY : 0;
			this.twist = eventInit.twist !== undefined ? eventInit.twist : 0;
			this.pointerType = eventInit.pointerType !== undefined ? eventInit.pointerType : '';
			this.isPrimary = eventInit.isPrimary || eventInit.isPrimary;
		}
	}
}
