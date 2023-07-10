import EventTarget from '../EventTarget.js';
import IUIEventInit from '../IUIEventInit.js';

export default interface IMouseEventInit extends IUIEventInit {
	screenX?: number;
	screenY?: number;
	clientX?: number;
	clientY?: number;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	button?: number;
	buttons?: number;
	relatedTarget?: EventTarget;
	region?: string;
}
