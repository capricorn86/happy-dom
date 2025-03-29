import { IOptionalBrowserSettings } from 'happy-dom-bundle';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';

export default interface IServerRendererOptions {
	settings: IOptionalBrowserSettings;
	cacheDirectory: string;
	disableCache: boolean;
    logLevel: ServerRendererLogLevelEnum;
	worker: {
		disable: boolean;
		maxConcurrency: number;
	};
	render: {
		maxConcurrency: number;
		serializableShadowRoots: boolean;
		allShadowRoots: boolean;
		excludeShadowRootTags: string[] | null;
	};
}
