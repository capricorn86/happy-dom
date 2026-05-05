import type EventTarget from '../EventTarget.js';
import type IUIEventInit from '../IUIEventInit.js';

export default interface IFocusEventInit extends IUIEventInit {
	relatedTarget?: EventTarget | null;
}
