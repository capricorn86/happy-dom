import IEventInit from '../IEventInit.js';

export default interface ICloseEventInit extends IEventInit {
	code?: number;
	reason?: string;
	wasClean?: boolean;
}
