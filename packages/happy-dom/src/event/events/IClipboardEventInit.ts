import type DataTransfer from '../DataTransfer.js';
import type IEventInit from '../IEventInit.js';

export default interface IClipboardEventInit extends IEventInit {
	clipboardData?: DataTransfer | null;
}
