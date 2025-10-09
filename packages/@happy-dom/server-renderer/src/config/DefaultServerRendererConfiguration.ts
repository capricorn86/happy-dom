import DefaultBrowserSettings from 'happy-dom/lib/browser/DefaultBrowserSettings.js';
import ServerRendererLogLevelEnum from '../enums/ServerRendererLogLevelEnum.js';
import type IServerRendererConfiguration from '../types/IServerRendererConfiguration.js';
import OS from 'os';
import { BrowserErrorCaptureEnum } from 'happy-dom';

export default <IServerRendererConfiguration>{
	browser: {
		...DefaultBrowserSettings,
		errorCapture: BrowserErrorCaptureEnum.processLevel,
		// This is enabled by default as the entire point of this package is to server-render client side JavaScript.
		// "--disallow-code-generation-from-strings" is enabled on workers to prevent escape of the VM context.
		enableJavaScriptEvaluation: true
	},
	outputDirectory: './happy-dom/render',
	logLevel: ServerRendererLogLevelEnum.info,
	debug: false,
	inspect: false,
	help: false,
	cache: {
		disable: false,
		directory: './happy-dom/cache',
		warmup: false
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
		start: false,
		serverURL: 'https://localhost:3000',
		targetOrigin: null,
		disableCache: false,
		disableCacheQueue: false,
		cacheTime: 60000 // 60 seconds
	}
};
