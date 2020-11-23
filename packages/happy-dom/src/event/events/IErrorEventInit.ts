import IEventInit from '../IEventInit';

export default interface IErrorEventInit extends IEventInit {
	message?: string;
	filename?: string;
	lineno?: number;
	colno?: number;
	error?: object;
}
