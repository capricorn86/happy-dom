import DataTransfer from '../DataTransfer';
import IUIEventInit from '../IUIEventInit';

export default interface IInputEventInit extends IUIEventInit {
	inputType?: string;
	data?: string;
	dataTransfer?: DataTransfer;
	isComposing?: boolean;
}
