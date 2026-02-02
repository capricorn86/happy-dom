import type IUIEventInit from '../IUIEventInit.js';
import type Touch from '../Touch.js';

export default interface ITouchEventInit extends IUIEventInit {
	touches?: Touch[] | null;
	targetTouches?: Touch[] | null;
	changedTouches?: Touch[] | null;
	ctrlKey?: boolean | null;
	shiftKey?: boolean | null;
	altKey?: boolean | null;
	metaKey?: boolean | null;
}
