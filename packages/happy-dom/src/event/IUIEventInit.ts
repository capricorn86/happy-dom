import IWindow from '../window/IWindow';
import IEventInit from './IEventInit';

export default interface IUIEventInit extends IEventInit {
	detail?: number;
	view?: IWindow;
}
