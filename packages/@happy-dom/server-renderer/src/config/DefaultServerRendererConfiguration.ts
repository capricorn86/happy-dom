import DefaultBrowserSettings from 'happy-dom/lib/browser/DefaultBrowserSettings.js';
import ServerRendererLogLevelEnum from '../enums/ServerRendererLogLevelEnum.js';
import IServerRendererConfiguration from '../types/IServerRendererConfiguration.js';
import OS from 'os';
import { BrowserErrorCaptureEnum } from 'happy-dom';

export default <IServerRendererConfiguration>{
	browser: { ...DefaultBrowserSettings, errorCapture: BrowserErrorCaptureEnum.processLevel },
	outputDirectory: './happy-dom/render',
	logLevel: ServerRendererLogLevelEnum.info,
	debug: false,
	inspect: false,
	cache: {
		disable: false,
		fileSystem: {
			directory: './happy-dom/cache',
			disable: false,
			warmup: false
		}
	},
	worker: {
		disable: false,
		maxConcurrency: Math.max(1, Math.floor(OS.cpus().length / 2))
	},
	render: {
		maxConcurrency: 10,
		timeout: 30000, // 30 seconds
		incognitoContext: false,
		serializableShadowRoots: false,
		allShadowRoots: false,
		excludeShadowRootTags: null,
		disablePolyfills: false
	},
	urls: null,
	server: {
		serverURL: 'https://localhost:3000',
		targetOrigin: null,
		disableCache: false,
		disableCacheQueue: false,
		cacheTime: 30000 // 30 seconds
	}
};
