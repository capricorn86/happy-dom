import IUIEventInit from '../IUIEventInit';

export default interface IErrorEventInit extends IUIEventInit {
	message?: string;
	filename?: string;
	lineno?: number;
	colno?: number;
	error?: object;
}
