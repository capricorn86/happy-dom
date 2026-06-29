import type IMouseEventInit from './IMouseEventInit.js';

export default interface IWheelEventInit extends IMouseEventInit {
	deltaX?: number;
	deltaY?: number;
	deltaZ?: number;
	deltaMode?: number;
	momentum?: boolean;
}
