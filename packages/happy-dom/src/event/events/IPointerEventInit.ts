import IMouseEventInit from './IMouseEventInit';

export default interface IPointerEventInit extends IMouseEventInit {
	pointerId?: number;
	width?: number;
	height?: number;
	pressure?: number;
	tangentialPressure?: number;
	tiltX?: number;
	tiltY?: number;
	twist?: number;
	pointerType?: string;
	isPrimary?: boolean;
}
