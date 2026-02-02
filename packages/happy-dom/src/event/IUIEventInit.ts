import type BrowserWindow from '../window/BrowserWindow.js';
import type IEventInit from './IEventInit.js';

export default interface IUIEventInit extends IEventInit {
	detail?: number;
	view?: BrowserWindow;
}
