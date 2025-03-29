#!/bin/env node
'use strict';

import { BrowserNavigationCrossOriginPolicyEnum } from 'happy-dom-bundle';
import IOptionalServerRendererOptions from '../../lib/IOptionalServerRendererOptions.js';
import ServerRendererLogLevelEnum from '../../lib/ServerRendererLogLevelEnum.js';

const INPUT_VALUE_REGEXP = /("[^"]+")/g;

main();

// export default <IBrowserSettings>{
// 	disableJavaScriptEvaluation: false,
// 	disableJavaScriptFileLoading: false,
// 	disableCSSFileLoading: false,
// 	disableIframePageLoading: false,
// 	disableComputedStyleRendering: false,
// 	disableErrorCapturing: false,
// 	errorCapture: BrowserErrorCaptureEnum.tryAndCatch,
// 	enableFileSystemHttpRequests: false,
// 	timer: {
// 		maxTimeout: -1,
// 		maxIntervalTime: -1,
// 		maxIntervalIterations: -1,
// 		preventTimerLoops: false
// 	},
// 	fetch: {
// 		disableSameOriginPolicy: false,
// 		interceptor: null,
// 		requestHeaders: null,
// 		virtualServers: null
// 	},
// 	navigation: {
// 		disableMainFrameNavigation: false,
// 		disableChildFrameNavigation: false,
// 		disableChildPageNavigation: false,
// 		disableFallbackToSetURL: false,
// 		crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.anyOrigin
// 	},
// 	navigator: {
// 		userAgent: `Mozilla/5.0 (X11; ${
// 			process.platform.charAt(0).toUpperCase() + process.platform.slice(1) + ' ' + process.arch
// 		}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`,
// 		maxTouchPoints: 0
// 	},
// 	device: {
// 		prefersColorScheme: 'light',
// 		prefersReducedMotion: 'no-preference',
// 		mediaType: 'screen',
// 		forcedColors: 'none'
// 	},
// 	debug: {
// 		traceWaitUntilComplete: -1
// 	},
// 	viewport: {
// 		width: 1024,
// 		height: 768,
// 		devicePixelRatio: 1
// 	}
// };


/**
 * Returns options.
 *
 * @returns Options.
 */
function getOptions(): IOptionalServerRendererOptions {
  const options: IOptionalServerRendererOptions = {};

  for (const arg of process.argv) {
    if (arg.startsWith('--settings.disableJavaScriptEvaluation')) {
        options.settings.disableJavaScriptEvaluation = true
    } else if (arg.startsWith('--settings.disableJavaScriptFileLoading')) {
        options.settings.disableJavaScriptFileLoading = true
    } else if (arg.startsWith('--settings.disableCSSFileLoading')) {
        options.settings.disableCSSFileLoading = true
    } else if (arg.startsWith('--settings.disableComputedStyleRendering')) {
        options.settings.disableComputedStyleRendering = true
    } else if (arg.startsWith('--settings.handleDisabledFileLoadingAsSuccess')) {
        options.settings.handleDisabledFileLoadingAsSuccess = true
    } else if (arg.startsWith('--settings.timer.maxTimeout=')) {
        options.settings.timer.maxTimeout = Number(arg.split('=')[1]);
        if(isNaN(options.settings.timer.maxTimeout)) {
            throw new Error('Invalid value for --settings.timer.maxTimeout');
        }
    } else if (arg.startsWith('--settings.timer.maxIntervalTime=')) {
        options.settings.timer.maxIntervalTime = Number(arg.split('=')[1]);
        if(isNaN(options.settings.timer.maxIntervalTime)) {
            throw new Error('Invalid value for --settings.timer.maxIntervalTime');
        }
    } else if (arg.startsWith('--settings.timer.maxIntervalIterations=')) {
        options.settings.timer.maxIntervalIterations = Number(arg.split('=')[1]);
        if(isNaN(options.settings.timer.maxIntervalIterations)) {
            throw new Error('Invalid value for --settings.timer.maxIntervalIterations');
        }
    } else if (arg.startsWith('--settings.timer.preventTimerLoops')) {
        options.settings.timer.preventTimerLoops = true
    } else if (arg.startsWith('--settings.fetch.disableSameOriginPolicy')) {
        options.settings.fetch.disableSameOriginPolicy = true
    } else if (arg.startsWith('--settings.fetch.interceptor=')) {
        throw new Error('The setting "settings.fetch.interceptor" can\'t be set via command line.');
    } else if (arg.startsWith('--settings.fetch.requestHeaders=') || arg.startsWith('-rh=')) {
        const requestHeaders = { url: null, headers: {} };
        let regexp = new RegExp(INPUT_VALUE_REGEXP);
        let match: RegExpExecArray | null;
        while(match = regexp.exec(arg.split('=')[1])) {
            if(!requestHeaders.url) {
                requestHeaders.url = new RegExp(match[1]);
            } else {
                const header = match[1].split(':');
                if(header.length !== 2) {
                    throw new Error(`Invalid header format: ${match[1]}`);
                }
                requestHeaders.headers[header[0].trim()] = header[1].trim();
            }
        }
        if(!requestHeaders.url) {
            throw new Error('Invalid value for --settings.fetch.requestHeaders');
        }
        if(!options.settings.fetch.requestHeaders) {
            options.settings.fetch.requestHeaders = [];
        }
        options.settings.fetch.requestHeaders.push(requestHeaders);
    } else if (arg.startsWith('--settings.fetch.virtualServer=') || arg.startsWith('--settings.fetch.virtualServers=') || arg.startsWith('-vs=')) {
        const virtualServer = { url: null, directory: null };
        let regexp = new RegExp(INPUT_VALUE_REGEXP);
        let match: RegExpExecArray | null;
        while(match = regexp.exec(arg.split('=')[1])) {
            if(!virtualServer.url) {
                virtualServer.url = new RegExp(match[1]);
            } else {
                virtualServer.directory = match[1];
            }
        }
        if(!virtualServer.url || !virtualServer.directory) {
            throw new Error('Invalid value for --settings.fetch.virtualServers');
        }
        if(!options.settings.fetch.virtualServers) {
            options.settings.fetch.virtualServers = [];
        }
        options.settings.fetch.virtualServers.push(virtualServer);
    } else if (arg.startsWith('--settings.navigation.disableMainFrameNavigation')) {
        options.settings.navigation.disableMainFrameNavigation = true
    } else if (arg.startsWith('--settings.navigation.disableChildFrameNavigation')) {
        options.settings.navigation.disableChildFrameNavigation = true
    } else if (arg.startsWith('--settings.navigation.disableChildPageNavigation')) {
        options.settings.navigation.disableChildPageNavigation = true
    } else if (arg.startsWith('--settings.navigation.disableFallbackToSetURL')) {
        options.settings.navigation.disableFallbackToSetURL = true
    } else if (arg.startsWith('--settings.navigation.crossOriginPolicy=')) {
        const value = arg.split('=')[1];
        if(BrowserNavigationCrossOriginPolicyEnum[value] === undefined) {
            throw new Error('Invalid value for --settings.navigation.crossOriginPolicy');
        }
        options.settings.navigation.crossOriginPolicy = <BrowserNavigationCrossOriginPolicyEnum>value
    } else if (arg.startsWith('--settings.navigator.userAgent=')) {
        options.settings.navigator.userAgent = arg.split('=')[1];
    } else if (arg.startsWith('--settings.navigator.maxTouchPoints=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --settings.navigator.maxTouchPoints');
        }
        options.settings.navigator.maxTouchPoints = value;
    } else if (arg.startsWith('--settings.device.prefersColorScheme=')) {
        options.settings.device.prefersColorScheme =  arg.split('=')[1];
    } else if (arg.startsWith('--settings.device.prefersReducedMotion=')) {
        options.settings.device.prefersReducedMotion = arg.split('=')[1];
    } else if (arg.startsWith('--settings.device.mediaType=')) {
        options.settings.device.mediaType = arg.split('=')[1];
    } else if (arg.startsWith('--settings.device.forcedColors=')) {
        options.settings.device.forcedColors = arg.split('=')[1];
    } else if (arg.startsWith('--settings.debug.traceWaitUntilComplete')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --settings.debug.traceWaitUntilComplete');
        }
        options.settings.debug.traceWaitUntilComplete = value;
    } else if (arg.startsWith('--settings.viewport.width=') || arg.startsWith('-vw=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --settings.viewport.width');
        }
        options.settings.viewport.width = value;
    } else if (arg.startsWith('--settings.viewport.height=') || arg.startsWith('-vh=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --settings.viewport.height');
        }
        options.settings.viewport.height = value;
    } else if (arg.startsWith('--settings.viewport.devicePixelRatio=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --settings.viewport.devicePixelRatio');
        }
        options.settings.viewport.devicePixelRatio = value;
    } else if (arg.startsWith('--cacheDirectory=')) {
        options.cacheDirectory = arg.split('=')[1];
    } else if (arg.startsWith('--disableCache')) {
        options.disableCache = true;
    } else if (arg.startsWith('--logLevel=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value) || ServerRendererLogLevelEnum[value] === undefined) {
            throw new Error('Invalid value for --logLevel');
        }
        options.logLevel = <ServerRendererLogLevelEnum>value;
    } else if (arg.startsWith('--worker.disable')) {
        options.worker.disable = true;
    }
    else if (arg.startsWith('--worker.maxConcurrency=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --worker.maxConcurrency');
        }
        options.worker.maxConcurrency = value;
    } else if (arg.startsWith('--render.maxConcurrency=')) {
        const value = Number(arg.split('=')[1]);
        if(isNaN(value)) {
            throw new Error('Invalid value for --render.maxConcurrency');
        }
        options.render.maxConcurrency = value;
    } else if (arg.startsWith('--render.incognitoContext')) {
        options.render.incognitoContext = true;
    } else if (arg.startsWith('--render.serializableShadowRoots')) {
        options.render.serializableShadowRoots = true;
    } else if (arg.startsWith('--render.allShadowRoots')) {
        options.render.allShadowRoots = true;
    } else if (arg.startsWith('--render.excludeShadowRootTags=')) {
        const value = arg.split('=')[1];
        options.render.excludeShadowRootTags = value.split(',');
    }
  }

  return options;
}

/**
 * Main method.
 */
function main() {
}