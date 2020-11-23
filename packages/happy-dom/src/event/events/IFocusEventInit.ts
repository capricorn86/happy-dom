import EventTarget from '../EventTarget';
import IUIEventInit from '../IUIEventInit';

export default interface IFocusEventInit extends IUIEventInit {
	relatedTarget?: EventTarget;
}
