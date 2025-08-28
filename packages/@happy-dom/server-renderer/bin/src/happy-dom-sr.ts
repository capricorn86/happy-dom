#!/bin/env node
'use strict';

import { BrowserNavigationCrossOriginPolicyEnum, IVirtualServer } from 'happy-dom';
import IOptionalServerRendererConfiguration from '../../lib/types/IOptionalServerRendererConfiguration.js';
import ServerRendererLogLevelEnum from '../../lib/enums/ServerRendererLogLevelEnum.js';
import type IServerRendererItem from '../../lib/types/IServerRendererItem.js';
import ServerRenderer from '../../lib/ServerRenderer.js';
import Path from 'path';
import IFetchRequestHeaders from 'happy-dom/lib/fetch/types/IFetchRequestHeaders.js';
import DefaultServerRendererConfiguration from '../../lib/config/DefaultServerRendererConfiguration.js';

main();

/**
 * Main method.
 */
async function main(): Promise<void> {
	const { configuration, items, startServer } = await getConfiguration();

	if (startServer) {
		const server = new (await import('../../lib/ServerRendererServer.js')).default(configuration);

		server.start();
	} else {
		const renderer = new ServerRenderer(configuration);

		await renderer.render(items);
	}
}

/**
 * Returns configuration.
 *
 * @returns Configuration.
 */
async function getConfiguration(): Promise<{
	configuration: IOptionalServerRendererConfiguration;
	items: IServerRendererItem[];
	startServer: boolean;
}> {
	const items: IServerRendererItem[] = [];
	let config: IOptionalServerRendererConfiguration = DefaultServerRendererConfiguration;
	let startServer = false;

	for (const arg of process.argv) {
		if (arg[0] === '-') {
			if (arg.startsWith('--browser.disableJavaScriptEvaluation')) {
				config.browser.disableJavaScriptEvaluation = true;
			} else if (arg.startsWith('--browser.disableJavaScriptFileLoading')) {
				config.browser.disableJavaScriptFileLoading = true;
			} else if (arg.startsWith('--browser.disableCSSFileLoading')) {
				config.browser.disableCSSFileLoading = true;
			} else if (arg.startsWith('--browser.disableComputedStyleRendering')) {
				config.browser.disableComputedStyleRendering = true;
			} else if (arg.startsWith('--browser.handleDisabledFileLoadingAsSuccess')) {
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
			} else if (arg.startsWith('--browser.timer.preventTimerLoops')) {
				config.browser.timer.preventTimerLoops = true;
			} else if (arg.startsWith('--browser.fetch.disableSameOriginPolicy')) {
				config.browser.fetch.disableSameOriginPolicy = true;
			} else if (arg.startsWith('--browser.fetch.interceptor=')) {
				throw new Error('The setting "browser.fetch.interceptor" can\'t be set via command line.');
			} else if (arg.startsWith('--browser.fetch.requestHeaders=') || arg.startsWith('-rh=')) {
				const requestHeaders: IFetchRequestHeaders = { url: null, headers: {} };
				const [url, headers] = arg.split('=')[1].split(';');

				if (!url || !headers) {
					throw new Error(`Invalid value for ${arg.split('=')[0]}`);
				}

				requestHeaders.url = new RegExp(url.trim());

				const groups = headers.split(',');

				for (const group of groups) {
					const parts = group.split(':');
					if (parts.length !== 2) {
						throw new Error(`Invalid value for ${arg.split('=')[0]}`);
					}
					requestHeaders.headers[parts[0].trim()] = parts[1].trim();
				}

				if (!config.browser.fetch.requestHeaders) {
					config.browser.fetch.requestHeaders = [];
				}

				config.browser.fetch.requestHeaders.push(requestHeaders);
			} else if (
				arg.startsWith('--browser.fetch.virtualServer=') ||
				arg.startsWith('--browser.fetch.virtualServers=') ||
				arg.startsWith('-vs=')
			) {
				const parts = arg.split('=')[1].split(';');
				if (parts.length !== 2) {
					throw new Error(`Invalid value for ${arg.split('=')[0]}`);
				}
				const virtualServer: IVirtualServer = {
					url: new RegExp(parts[0].trim()),
					directory: Path.resolve(parts[1].trim())
				};
				if (!config.browser.fetch.virtualServers) {
					config.browser.fetch.virtualServers = [];
				}
				config.browser.fetch.virtualServers.push(virtualServer);
			} else if (arg.startsWith('--browser.navigation.disableMainFrameNavigation')) {
				config.browser.navigation.disableMainFrameNavigation = true;
			} else if (arg.startsWith('--browser.navigation.disableChildFrameNavigation')) {
				config.browser.navigation.disableChildFrameNavigation = true;
			} else if (arg.startsWith('--browser.navigation.disableChildPageNavigation')) {
				config.browser.navigation.disableChildPageNavigation = true;
			} else if (arg.startsWith('--browser.navigation.disableFallbackToSetURL')) {
				config.browser.navigation.disableFallbackToSetURL = true;
			} else if (arg.startsWith('--browser.navigation.crossOriginPolicy=')) {
				const value = arg.split('=')[1];
				if (BrowserNavigationCrossOriginPolicyEnum[value] === undefined) {
					throw new Error(`Invalid value for ${arg.split('=')[0]}`);
				}
				config.browser.navigation.crossOriginPolicy = <BrowserNavigationCrossOriginPolicyEnum>value;
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
			} else if (arg.startsWith('--cache.disable=')) {
				config.cache.disable = true;
			} else if (arg.startsWith('--cache.fileSystem.directory=')) {
				config.cache.fileSystem.directory = stripQuotes(arg.split('=')[1]);
			} else if (arg.startsWith('--cache.fileSystem.disable')) {
				config.cache.fileSystem.disable = true;
			} else if (arg.startsWith('--cache.fileSystem.warmup')) {
				config.cache.fileSystem.warmup = true;
			} else if (arg.startsWith('--logLevel=')) {
				const value = Number(arg.split('=')[1]);
				if (isNaN(value) || ServerRendererLogLevelEnum[value] === undefined) {
					throw new Error(`Invalid value for ${arg.split('=')[0]}`);
				}
				config.logLevel = <ServerRendererLogLevelEnum>value;
			} else if (arg.startsWith('--worker.disable')) {
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
			} else if (arg.startsWith('--render.incognitoContext')) {
				config.render.incognitoContext = true;
			} else if (arg.startsWith('--render.serializableShadowRoots')) {
				config.render.serializableShadowRoots = true;
			} else if (arg.startsWith('--render.allShadowRoots')) {
				config.render.allShadowRoots = true;
			} else if (arg.startsWith('--render.excludeShadowRootTags=')) {
				const value = arg.split('=')[1];
				config.render.excludeShadowRootTags = value.split(',');
			} else if (arg.startsWith('--debug')) {
				config.debug = true;
			} else if (arg.startsWith('--inspect')) {
				config.inspect = true;
			} else if (arg.startsWith('--outputDirectory=')) {
				config.outputDirectory = stripQuotes(arg.split('=')[1]);
			} else if (arg.startsWith('--config=')) {
				config = (await import(Path.resolve(stripQuotes(arg.split('=')[1])))).default;
			} else if (arg === '--server') {
				startServer = true;
			}
		} else if (arg) {
			const item: IServerRendererItem = { url: null, outputFile: null };
			const urlString =
				arg[0] === '"' && arg[arg.length - 1] === '"' ? arg.substring(1, arg.length - 1) : arg;

			let url: URL;
			try {
				url = new URL(urlString);
			} catch (e) {
				// Ignore
			}

			if (url) {
				// We need to replace the first slash to make the path relative to the current directory
				item.outputFile = url.pathname.replace('/', '');

				item.url = url.href;

				const parts = item.outputFile.split('/');

				if (!parts[parts.length - 1].includes('.')) {
					if (parts[parts.length - 1]) {
						item.outputFile += '/';
					}
					item.outputFile += 'index.html';
				}

				items.push(item);
			}
		}
	}

	return { configuration: config, items, startServer };
}

function stripQuotes(value: string): string {
	if (value[0] === '"' && value[value.length - 1] === '"') {
		return value.substring(1, value.length - 1);
	}
	return value;
}
