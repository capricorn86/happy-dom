import IEventInit from '../IEventInit.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import IMessagePort from '../IMessagePort.js';

export default interface IMessageEventInit extends IEventInit {
	data?: unknown | null;
	origin?: string;
	lastEventId?: string;
	source?: IBrowserWindow | null;
	ports?: IMessagePort[];
}
