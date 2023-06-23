import EventTarget from '../EventTarget';
import IUIEventInit from '../IUIEventInit';

export default interface IMouseEventInit extends IUIEventInit {
	screenX?: number;
	screenY?: number;
	clientX?: number;
	clientY?: number;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	movementX?: number;
	movementY?: number;
	button?: number;
	buttons?: number;
	relatedTarget?: EventTarget;
	region?: string;
}
