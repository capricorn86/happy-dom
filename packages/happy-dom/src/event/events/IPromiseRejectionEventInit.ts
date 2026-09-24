import IEventInit from '../IEventInit.js';

export default interface IPromiseRejectionEventInit extends IEventInit {
	promise: Promise<unknown>;
	reason?: unknown;
}
