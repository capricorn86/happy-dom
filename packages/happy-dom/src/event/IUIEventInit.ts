import IWindow from '../window/IWindow.js';
import IEventInit from './IEventInit.js';

export default interface IUIEventInit extends IEventInit {
	detail?: number;
	view?: IWindow;
}
