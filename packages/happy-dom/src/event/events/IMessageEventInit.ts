import type IEventInit from '../IEventInit.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import type MessagePort from '../MessagePort.js';

export default interface IMessageEventInit extends IEventInit {
	data?: unknown | null;
	origin?: string;
	lastEventId?: string;
	source?: BrowserWindow | null;
	ports?: MessagePort[];
}
