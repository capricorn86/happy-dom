import IEventInit from '../IEventInit';
import IWindow from '../../window/IWindow';
import IMessagePort from '../IMessagePort';

export default interface IMessageEventInit extends IEventInit {
	data?: unknown | null;
	origin?: string;
	lastEventId?: string;
	source?: IWindow | null;
	ports?: IMessagePort[];
}
