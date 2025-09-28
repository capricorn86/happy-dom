import DefaultServerRendererConfiguration from '../config/DefaultServerRendererConfiguration.js';
import IServerRendererConfiguration from '../types/IServerRendererConfiguration.js';
import IServerRendererItem from '../types/IServerRendererItem.js';
import Path from 'path';
import { BrowserNavigationCrossOriginPolicyEnum } from 'happy-dom';
import ServerRendererLogLevelEnum from '../enums/ServerRendererLogLevelEnum.js';

/**
 * CLI process arguments parser.
 */
export default class ProcessArgumentsParser {
	/**
	 * Returns configuration from process arguments.
	 *
	 * @param args Arguments.
	 */
	public static async getConfiguration(args: string[]): Promise<IServerRendererConfiguration> {
		let config: IServerRendererConfiguration = JSON.parse(
			JSON.stringify(DefaultServerRendererConfiguration)
		);

		for (const arg of args) {
			if (arg[0] === '-') {
				if (arg.startsWith('--config=') || arg.startsWith('-c=')) {
					config = (await import(Path.resolve(this.stripQuotes(arg.split('=')[1])))).default;
				} else if (arg === '--help' || arg === '-h') {
					config.help = true;
				} else if (arg === '--browser.disableJavaScriptEvaluation') {
					config.browser.disableJavaScriptEvaluation = true;
				} else if (arg === '--browser.disableJavaScriptFileLoading') {
					config.browser.disableJavaScriptFileLoading = true;
				} else if (arg === '--browser.disableCSSFileLoading') {
					config.browser.disableCSSFileLoading = true;
				} else if (arg === '--browser.disableComputedStyleRendering') {
					config.browser.disableComputedStyleRendering = true;
				} else if (arg === '--browser.handleDisabledFileLoadingAsSuccess') {
					config.browser.handleDisabledFileLoadingAsSuccess = true;
				} else if (arg.startsWith('--browser.timer.maxTimeout=')) {
					config.browser.timer.maxTimeout = Number(arg.split('=')[1]);
					if (isNaN(config.browser.timer.maxTimeout)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
				} else if (arg.startsWith('--browser.timer.maxIntervalTime=')) {
					config.browser.timer.maxIntervalTime = Number(arg.split('=')[1]);
					if (isNaN(config.browser.timer.maxIntervalTime)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
				} else if (arg.startsWith('--browser.timer.maxIntervalIterations=')) {
					config.browser.timer.maxIntervalIterations = Number(arg.split('=')[1]);
					if (isNaN(config.browser.timer.maxIntervalIterations)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
				} else if (arg === '--browser.timer.preventTimerLoops') {
					config.browser.timer.preventTimerLoops = true;
				} else if (arg === '--browser.fetch.disableSameOriginPolicy') {
					config.browser.fetch.disableSameOriginPolicy = true;
				} else if (arg === '--browser.fetch.disableStrictSSL') {
					config.browser.fetch.disableStrictSSL = true;
				} else if (arg.startsWith('--browser.fetch.interceptor=')) {
					throw new Error(
						'The setting "browser.fetch.interceptor" can\'t be set via command line.'
					);
				} else if (
					arg.startsWith('--browser.fetch.requestHeader=') ||
					arg.startsWith('--browser.fetch.requestHeaders=') ||
					arg.startsWith('-rh=')
				) {
					const parts = this.stripQuotes(arg.split('=')[1]).split('|');
					const url = parts.length === 2 ? parts[0].trim() : null;
					const header = parts.length === 2 ? parts[1] : parts[0];
					const [key, value] = header.split(':');
					let hasRequestHeaders = false;

					if (!config.browser.fetch.requestHeaders) {
						config.browser.fetch.requestHeaders = [];
					}

					for (const requestHeaders of config.browser.fetch.requestHeaders) {
						if (
							(!url && !requestHeaders.url) ||
							(url && requestHeaders.url instanceof RegExp && requestHeaders.url.test(url))
						) {
							hasRequestHeaders = true;
							requestHeaders.headers[key.trim()] = (value || '').trim();
							break;
						}
					}

					if (!hasRequestHeaders) {
						config.browser.fetch.requestHeaders.push({
							url: url ? new RegExp(url) : null,
							headers: {
								[key.trim()]: (value || '').trim()
							}
						});
					}
				} else if (
					arg.startsWith('--browser.fetch.virtualServer=') ||
					arg.startsWith('--browser.fetch.virtualServers=') ||
					arg.startsWith('-vs=')
				) {
					const parts = this.stripQuotes(arg.split('=')[1]).split('|');
					if (parts.length !== 2) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					if (!config.browser.fetch.virtualServers) {
						config.browser.fetch.virtualServers = [];
					}
					config.browser.fetch.virtualServers.push({
						url: new RegExp(parts[0].trim()),
						directory: parts[1].trim()
					});
				} else if (arg === '--browser.navigation.disableMainFrameNavigation') {
					config.browser.navigation.disableMainFrameNavigation = true;
				} else if (arg === '--browser.navigation.disableChildFrameNavigation') {
					config.browser.navigation.disableChildFrameNavigation = true;
				} else if (arg === '--browser.navigation.disableChildPageNavigation') {
					config.browser.navigation.disableChildPageNavigation = true;
				} else if (arg === '--browser.navigation.disableFallbackToSetURL') {
					config.browser.navigation.disableFallbackToSetURL = true;
				} else if (arg.startsWith('--browser.navigation.crossOriginPolicy=')) {
					const value = arg.split('=')[1];
					if ((<any>BrowserNavigationCrossOriginPolicyEnum)[value] === undefined) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.navigation.crossOriginPolicy = <BrowserNavigationCrossOriginPolicyEnum>(
						value
					);
				} else if (arg.startsWith('--browser.navigation.beforeContentCallback=')) {
					throw new Error(
						'The setting "browser.navigation.beforeContentCallback" can\'t be set via command line.'
					);
				} else if (arg.startsWith('--browser.navigator.userAgent=')) {
					config.browser.navigator.userAgent = arg.split('=')[1];
				} else if (arg.startsWith('--browser.navigator.maxTouchPoints=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.navigator.maxTouchPoints = value;
				} else if (arg.startsWith('--browser.device.prefersColorScheme=')) {
					config.browser.device.prefersColorScheme = arg.split('=')[1];
				} else if (arg.startsWith('--browser.device.prefersReducedMotion=')) {
					config.browser.device.prefersReducedMotion = arg.split('=')[1];
				} else if (arg.startsWith('--browser.device.mediaType=')) {
					config.browser.device.mediaType = arg.split('=')[1];
				} else if (arg.startsWith('--browser.device.forcedColors=')) {
					config.browser.device.forcedColors = arg.split('=')[1];
				} else if (arg.startsWith('--browser.debug.traceWaitUntilComplete=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.debug.traceWaitUntilComplete = value;
				} else if (arg.startsWith('--browser.viewport.width=') || arg.startsWith('-vw=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.viewport.width = value;
				} else if (arg.startsWith('--browser.viewport.height=') || arg.startsWith('-vh=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.viewport.height = value;
				} else if (arg.startsWith('--browser.viewport.devicePixelRatio=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.browser.viewport.devicePixelRatio = value;
				} else if (arg === '--cache.disable') {
					config.cache.disable = true;
				} else if (arg.startsWith('--cache.directory=') || arg.startsWith('-cd=')) {
					config.cache.directory = this.stripQuotes(arg.split('=')[1]);
				} else if (arg === '--cache.warmup') {
					config.cache.warmup = true;
				} else if (arg.startsWith('--logLevel=') || arg.startsWith('-l=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value) || ServerRendererLogLevelEnum[value] === undefined) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.logLevel = <ServerRendererLogLevelEnum>value;
				} else if (arg === '--worker.disable') {
					config.worker.disable = true;
				} else if (arg.startsWith('--worker.maxConcurrency=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.worker.maxConcurrency = value;
				} else if (arg.startsWith('--render.maxConcurrency=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.render.maxConcurrency = value;
				} else if (arg.startsWith('--render.timeout=') || arg.startsWith('-rt=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.render.timeout = value;
				} else if (arg === '--render.incognitoContext') {
					config.render.incognitoContext = true;
				} else if (arg === '--render.serializableShadowRoots') {
					config.render.serializableShadowRoots = true;
				} else if (arg === '--render.allShadowRoots') {
					config.render.allShadowRoots = true;
				} else if (arg.startsWith('--render.excludeShadowRootTags=')) {
					const value = arg.split('=')[1];
					config.render.excludeShadowRootTags = value.split(',');
				} else if (arg === '--render.disablePolyfills') {
					config.render.disablePolyfills = true;
				} else if (arg === '--debug' || arg === '-d') {
					config.debug = true;
				} else if (arg === '--inspect' || arg === '-i') {
					config.inspect = true;
				} else if (arg.startsWith('--outputDirectory=') || arg.startsWith('-o=')) {
					config.outputDirectory = this.stripQuotes(arg.split('=')[1]);
				} else if (arg.startsWith('--server.serverURL=') || arg.startsWith('-su=')) {
					config.server.serverURL = this.stripQuotes(arg.split('=')[1]);
				} else if (arg.startsWith('--server.targetOrigin=') || arg.startsWith('-st=')) {
					config.server.targetOrigin = this.stripQuotes(arg.split('=')[1]);
				} else if (arg === '--server.disableCache' || arg === '-sdc') {
					config.server.disableCache = true;
				} else if (arg === '--server.disableCacheQueue' || arg === '-sdq') {
					config.server.disableCacheQueue = true;
				} else if (arg.startsWith('--server.cacheTime=') || arg.startsWith('-sct=')) {
					const value = Number(arg.split('=')[1]);
					if (isNaN(value)) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					config.server.cacheTime = value;
				} else if (arg === '--server.start' || arg === '--server' || arg === '-s') {
					config.server.start = true;
				} else if (arg.startsWith('--urls=')) {
					throw new Error(
						'URLs shouldn\'t be set by "--urls=". Instead set them with quotes without an argument name. E.g. "https://example.com/page" "https://example.com/another/page"'
					);
				}
			} else if (arg) {
				const urlString =
					arg[0] === '"' && arg[arg.length - 1] === '"' ? arg.substring(1, arg.length - 1) : arg;

				let url: URL | null = null;
				try {
					url = new URL(urlString);
				} catch (e) {
					// Ignore
				}

				if (url) {
					// We need to replace the first slash to make the path relative to the current directory
					const item: IServerRendererItem = {
						url: url.href,
						outputFile: url.pathname.replace('/', '')
					};

					const parts = item.outputFile!.split('/');

					if (!parts[parts.length - 1].includes('.')) {
						if (parts[parts.length - 1]) {
							item.outputFile += '/';
						}
						item.outputFile += 'index.html';
					}

					if (!config.urls) {
						config.urls = [];
					}

					config.urls.push(item);
				}
			}
		}

		return config;
	}

	/**
	 * Strips quotes from value.
	 *
	 * @param value Value.
	 * @returns Stripped value.
	 */
	private static stripQuotes(value: string): string {
		if (value[0] === '"' && value[value.length - 1] === '"') {
			return value.substring(1, value.length - 1);
		}
		return value;
	}
}
