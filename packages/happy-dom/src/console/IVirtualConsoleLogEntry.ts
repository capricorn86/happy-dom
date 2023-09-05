import IVirtualConsoleLogGroup from './IVirtualConsoleLogGroup.js';
import VirtualConsoleLogLevelEnum from './VirtualConsoleLogLevelEnum.js';
import VirtualConsoleLogTypeEnum from './VirtualConsoleLogTypeEnum.js';

export default interface IVirtualConsoleLogEntry {
	type: VirtualConsoleLogTypeEnum;
	level: VirtualConsoleLogLevelEnum;
	message: Array<string | object>;
	group: IVirtualConsoleLogGroup | null;
}
