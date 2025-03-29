import { DefaultBrowserSettings } from 'happy-dom-bundle';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';
import IServerRendererOptions from './IServerRendererOptions.js';
const OS = require('os');

export default <IServerRendererOptions>{
	settings: DefaultBrowserSettings,
	cacheDirectory: '',
	disableCache: false,
    logLevel: ServerRendererLogLevelEnum.warn,
	worker: {
		disable: false,
		maxConcurrency: Math.max(1, Math.floor(OS.cpus().length / 2)),
	},
	render: {
		maxConcurrency: 10,
		serializableShadowRoots: false,
		allShadowRoots: false,
		excludeShadowRootTags: null
	}
}
