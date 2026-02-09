import type DataTransfer from '../DataTransfer.js';
import type IUIEventInit from '../IUIEventInit.js';

export default interface IInputEventInit extends IUIEventInit {
	inputType?: string;
	data?: string;
	dataTransfer?: DataTransfer;
	isComposing?: boolean;
}
