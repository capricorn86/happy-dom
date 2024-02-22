import IEventTarget from './IEventTarget.js';

export default interface ITouchInit {
	identifier: number;
	target: IEventTarget;
	clientX?: number;
	clientY?: number;
	screenX?: number;
	screenY?: number;
	pageX?: number;
	pageY?: number;
	radiusX?: number;
	radiusY?: number;
	rotationAngle?: number;
	force?: number;
}
