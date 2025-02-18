import { IOptionalBrowserSettings, IOptionalBrowserPageViewport } from 'happy-dom';

export default interface IOptionalServerSideRenderOptions {
	viewport?: IOptionalBrowserPageViewport;
	settings?: IOptionalBrowserSettings;
	cacheDirectory?: string;
	disableCache?: boolean;
	requestHeaders?: [
		{
			url: string | RegExp;
			headers: {
				[key: string]: string;
			};
		}
	];
	worker?: {
		disable?: boolean;
		maxConcurrency?: number;
	};
	render?: {
		maxConcurrency?: number;
		serializableShadowRoots?: boolean;
		allShadowRoots?: boolean;
		excludeShadowRootTags?: string[];
	};
}
