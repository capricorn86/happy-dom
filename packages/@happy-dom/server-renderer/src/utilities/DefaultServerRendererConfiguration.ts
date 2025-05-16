import DefaultBrowserSettings from 'happy-dom/lib/browser/DefaultBrowserSettings.js';
import ServerRendererLogLevelEnum from '../types/ServerRendererLogLevelEnum.js';
import IServerRendererConfiguration from '../types/IServerRendererConfiguration.js';
import OS from 'os';
import { BrowserErrorCaptureEnum } from 'happy-dom';

export default <IServerRendererConfiguration>{
	browser: { ...DefaultBrowserSettings, errorCapture: BrowserErrorCaptureEnum.processLevel },
	outputDirectory: './happy-dom-sr/output',
	logLevel: ServerRendererLogLevelEnum.info,
	debug: false,
	inspect: false,
	cache: {
		directory: './happy-dom-sr/cache',
		disable: false
	},
	worker: {
		disable: false,
		maxConcurrency: Math.max(1, Math.floor(OS.cpus().length / 2))
	},
	render: {
		maxConcurrency: 10,
		timeout: 30000,
		incognitoContext: false,
		serializableShadowRoots: false,
		allShadowRoots: false,
		excludeShadowRootTags: null,
		disablePolyfills: null
	},
	urls: null,
	server: {
		serverURL: 'https://localhost:3000',
		targetOrigin: null,
		renderCacheTime: 1000 * 30 // 30 seconds
	}
};
