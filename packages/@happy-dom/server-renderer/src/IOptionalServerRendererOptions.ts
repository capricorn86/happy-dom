import type { IOptionalBrowserSettings } from 'happy-dom-bundle';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';

export default interface IOptionalServerRendererOptions {
	settings?: IOptionalBrowserSettings;
	cacheDirectory?: string;
	disableCache?: boolean;
    logLevel?: ServerRendererLogLevelEnum;
	worker?: {
		disable?: boolean;
		maxConcurrency?: number;
	};
	render?: {
		maxConcurrency?: number;
        incognitoContext?: boolean;
		serializableShadowRoots?: boolean;
		allShadowRoots?: boolean;
		excludeShadowRootTags?: string[] | null;
	};
}
