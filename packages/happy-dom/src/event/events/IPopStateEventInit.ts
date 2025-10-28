import IEventInit from '../IEventInit.js';

export default interface IPopStateEventInit extends IEventInit {
	state?: object | null;
	hasUAVisualTransition?: boolean;
}
