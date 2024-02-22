import IBrowserWindow from '../window/IBrowserWindow.js';
import IEventInit from './IEventInit.js';

export default interface IUIEventInit extends IEventInit {
	detail?: number;
	view?: IBrowserWindow;
}
