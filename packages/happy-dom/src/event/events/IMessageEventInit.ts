import IEventInit from '../IEventInit.js';
import IWindow from '../../window/IWindow.js';
import IMessagePort from '../IMessagePort.js';

export default interface IMessageEventInit extends IEventInit {
	data?: unknown | null;
	origin?: string;
	lastEventId?: string;
	source?: IWindow | null;
	ports?: IMessagePort[];
}
