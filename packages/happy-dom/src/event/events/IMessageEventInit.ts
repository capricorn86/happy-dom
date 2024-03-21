import IEventInit from '../IEventInit.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import IMessagePort from '../IMessagePort.js';

export default interface IMessageEventInit extends IEventInit {
	data?: unknown | null;
	origin?: string;
	lastEventId?: string;
	source?: BrowserWindow | null;
	ports?: IMessagePort[];
}
