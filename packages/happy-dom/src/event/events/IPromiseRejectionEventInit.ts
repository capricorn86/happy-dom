import IEventInit from '../IEventInit.js';

/**
 * Promise rejection event init.
 */
export default interface IPromiseRejectionEventInit extends IEventInit {
	promise: Promise<any>;
	reason?: any;
}