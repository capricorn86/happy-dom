import Window from '../window/Window';
import IEventInit from './IEventInit';

export default interface IUIEventInit extends IEventInit {
	detail?: number;
	view?: Window;
}
