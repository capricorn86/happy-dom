import type IVirtualConsoleLogGroup from './IVirtualConsoleLogGroup.js';
import type VirtualConsoleLogLevelEnum from './enums/VirtualConsoleLogLevelEnum.js';
import type VirtualConsoleLogTypeEnum from './enums/VirtualConsoleLogTypeEnum.js';

export default interface IVirtualConsoleLogEntry {
	type: VirtualConsoleLogTypeEnum;
	level: VirtualConsoleLogLevelEnum;
	message: Array<string | any>;
	group: IVirtualConsoleLogGroup | null;
}
