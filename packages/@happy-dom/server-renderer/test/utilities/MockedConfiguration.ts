import { BrowserErrorCaptureEnum, BrowserNavigationCrossOriginPolicyEnum } from 'happy-dom';
import IServerRendererConfiguration from '../../src/types/IServerRendererConfiguration';
import ServerRendererLogLevelEnum from '../../src/enums/ServerRendererLogLevelEnum';

export default <IServerRendererConfiguration>{
	browser: {
		disableJavaScriptEvaluation: false,
		enableJavaScriptEvaluation: false,
		suppressCodeGenerationFromStringsWarning: false,
		suppressInsecureJavaScriptEnvironmentWarning: true,
		disableJavaScriptFileLoading: true,
		disableCSSFileLoading: true,
		disableIframePageLoading: false,
		disableComputedStyleRendering: true,
		handleDisabledFileLoadingAsSuccess: true,
		disableErrorCapturing: false,
		errorCapture: BrowserErrorCaptureEnum.processLevel,
		enableFileSystemHttpRequests: false,
		timer: {
			maxTimeout: 2,
			maxIntervalTime: 2,
			maxIntervalIterations: 2,
			preventTimerLoops: true
		},
		fetch: {
			disableSameOriginPolicy: true,
			disableStrictSSL: true,
			interceptor: null,
			requestHeaders: [
				{
					url: null,
					headers: {
						'X-Custom-Header-1': 'Value-1'
					}
				},
				{
					url: new RegExp('https://example.com/'),
					headers: {
						'X-Custom-Header-2': 'Value-2'
					}
				}
			],
			virtualServers: [
				{
					url: new RegExp('https://example.com/path/'),
					directory: './virtual-server/path'
				}
			]
		},
		navigation: {
			disableMainFrameNavigation: true,
			disableChildFrameNavigation: true,
			disableChildPageNavigation: true,
			disableFallbackToSetURL: true,
			crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin,
			beforeContentCallback: null
		},
		navigator: {
			userAgent: 'Test User Agent',
			maxTouchPoints: 0
		},
		device: {
			prefersColorScheme: 'dark',
			prefersReducedMotion: 'reduce',
			mediaType: 'print',
			forcedColors: 'active'
		},
		debug: {
			traceWaitUntilComplete: 10000
		},
		viewport: {
			width: 1920,
			height: 1080,
			devicePixelRatio: 2
		}
	},
	outputDirectory: './output/render',
	logLevel: ServerRendererLogLevelEnum.error,
	help: false,
	debug: true,
	inspect: true,
	cache: {
		disable: true,
		directory: './output/cache',
		warmup: true
	},
	worker: {
		disable: true,
		maxConcurrency: 2
	},
	render: {
		maxConcurrency: 2,
		timeout: 10000,
		incognitoContext: true,
		serializableShadowRoots: true,
		allShadowRoots: true,
		excludeShadowRootTags: ['STYLE', 'SCRIPT'],
		disablePolyfills: true
	},
	urls: [
		{ url: 'https://example.com/page1', outputFile: 'page1/index.html' },
		{
			url: 'https://example.com/page2',
			outputFile: 'page2/index.html',
			headers: { 'X-Test': 'Value' }
		},
		'https://example.com/page3'
	],
	server: {
		start: true,
		serverURL: 'https://localhost:8080',
		targetOrigin: 'https://example.com',
		disableCache: true,
		disableCacheQueue: true,
		cacheTime: 10000
	}
};
