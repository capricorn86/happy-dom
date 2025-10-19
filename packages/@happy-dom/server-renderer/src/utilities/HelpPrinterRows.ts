export default [
	['Argument', 'Aliases', 'Type', 'Description', 'Default'],
	[
		'-------------------------------------------------',
		'----------------------------------',
		'----------',
		'--------------------------------------------------------------------------------------',
		'---------------------'
	],
	['"<url>"', '', 'string', 'One or more URLs to render.', ''],
	['--help', '-h', 'boolean', 'Displays this help information.', 'false'],
	['--config=<path>', '-c', 'string', 'Path to the configuration file.', ''],
	[
		'--outputDirectory=<path>',
		'-o',
		'string',
		'Directory to save rendered output.',
		'./happy-dom/render'
	],
	['--cache.disable', '', 'boolean', 'Disables fetch response cache.', 'false'],
	['--cache.warmup', '', 'boolean', 'Renders the first URL first to warmup the cache.', 'false'],
	[
		'--cache.directory=<path>',
		'-cd',
		'string',
		'Directory to store the cache.',
		'./happy-dom/cache'
	],
	[
		'--debug',
		'-d',
		'boolean',
		'Enables debug mode which is collected when the rendering has timed out.',
		'false'
	],
	[
		'--inspect',
		'-i',
		'boolean',
		'Enables inspector mode. Opens a Chromium DevTools inspector for each worker.',
		'false'
	],
	[
		'--logLevel=<level>',
		'-l',
		'number',
		'Sets the log level (0-4). 0: none, 1: error, 2: warn, 3: info, 4: debug.',
		'3'
	],
	[
		'--server.start',
		'--server, -s',
		'boolean',
		'Starts the server renderer proxy server.',
		'false'
	],
	[
		'--server.serverURL=<url>',
		'-su',
		'string',
		'URL of the server renderer proxy server.',
		'http://localhost:3000'
	],
	['--server.targetOrigin=<url>', '-st', 'string', 'Target origin (e.g. https://example.com)', ''],
	['--server.disableCache', '-sdc', 'boolean', 'Disables the server memory cache.', 'false'],
	[
		'--server.disableCacheQueue',
		'-sdq',
		'boolean',
		'Disables the server memory cache queue.',
		'false'
	],
	[
		'--server.cacheTime=<ms>',
		'-sct',
		'number',
		'Time in milliseconds to keep items in the server memory cache.',
		'60000'
	],
	[
		'--render.timeout=<ms>',
		'-rt',
		'number',
		'Time in milliseconds to wait before considering the rendering as timed out.',
		'30000'
	],
	[
		'--render.maxConcurrency=<number>',
		'',
		'number',
		'Maximum number of concurrent renderings inside a worker.',
		'10'
	],
	[
		'--render.incognitoContext',
		'',
		'boolean',
		'Enables incognito context for each rendering.',
		'false'
	],
	['--render.serializableShadowRoots', '', 'boolean', 'Render serializable shadow roots.', 'false'],
	['--render.allShadowRoots', '', 'boolean', 'Render all shadow roots.', 'false'],
	[
		'--render.excludeShadowRootTags=<tags>',
		'',
		'string[]',
		'Comma-separated list of tags to exclude shadow root rendering for.',
		''
	],
	['--render.disablePolyfills', '', 'boolean', 'Disables polyfills.', 'false'],
	['--worker.disable', '', 'boolean', 'Disables workers.', 'false'],
	[
		'--worker.maxConcurrency=<number>',
		'',
		'number',
		'Maximum number of concurrent workers. 50% of CPU threads by default.',
		''
	],
	['--browser.viewport.width=<number>', '-vw', 'number', 'Sets the viewport width.', '1024'],
	['--browser.viewport.height=<number>', '-vh', 'number', 'Sets the viewport height.', '768'],
	[
		'--browser.viewport.devicePixelRatio=<number>',
		'',
		'number',
		'Sets the device pixel ratio.',
		'1'
	],
	[
		'--browser.disableJavaScriptEvaluation',
		'',
		'boolean',
		'Disables JavaScript evaluation.',
		'false'
	],
	[
		'--browser.suppressInsecureJavaScriptEnvironmentWarning',
		'',
		'boolean',
		'Suppresses the warning that is printed when code generation from strings is enabled at process level',
		'false'
	],
	[
		'--browser.disableJavaScriptFileLoading',
		'',
		'boolean',
		'Disables JavaScript file loading.',
		'false'
	],
	['--browser.disableCSSFileLoading', '', 'boolean', 'Disables CSS file loading.', 'false'],
	[
		'--browser.disableComputedStyleRendering',
		'',
		'boolean',
		'Disables computed style rendering.',
		'false'
	],
	[
		'--browser.timer.maxTimeout',
		'',
		'boolean',
		'Maximum value for setTimeout and setInterval.',
		''
	],
	['--browser.timer.maxIntervalTime', '', 'boolean', 'Maximum interval time for setInterval.', ''],
	[
		'--browser.timer.maxIntervalIterations',
		'',
		'boolean',
		'Maximum interval iterations for setInterval.',
		''
	],
	['--browser.timer.preventTimerLoops', '', 'boolean', 'Prevents timer loops.', 'false'],
	[
		'--browser.fetch.disableSameOriginPolicy',
		'',
		'boolean',
		'Disables same-origin policy for fetch requests.',
		'false'
	],
	[
		'--browser.fetch.disableStrictSSL',
		'',
		'boolean',
		'Disables strict SSL for fetch requests.',
		'false'
	],
	[
		'--browser.fetch.requestHeaders=<value>',
		'--browser.fetch.requestHeader, -rh',
		'string',
		'Request header. E.g. -rh="Header:Value" or -rh="^https://e.com/[a-z]{2}/|Header:Value"',
		''
	],
	[
		'--browser.fetch.virtualServers=<value>',
		'--browser.fetch.virtualServer, -vs',
		'string',
		'Setup a virtual server. E.g. -vs="^https://e.com/[a-z]{2}/|./build"',
		''
	],
	[
		'--browser.navigation.disableMainFrameNavigation',
		'',
		'boolean',
		'Disables main frame navigation.',
		'false'
	],
	[
		'--browser.navigation.disableChildFrameNavigation',
		'',
		'boolean',
		'Disables child frame navigation.',
		'false'
	],
	[
		'--browser.navigation.disableChildPageNavigation',
		'',
		'boolean',
		'Disables child page navigation.',
		'false'
	],
	[
		'--browser.navigation.disableFallbackToSetURL',
		'',
		'boolean',
		'Disables fallback to set the location of the window.',
		'false'
	],
	[
		'--browser.navigation.crossOriginPolicy=<policy>',
		'',
		'string',
		'Sets the cross-origin navigation policy. "anyOrigin", "sameOrigin" or "strictOrigin".',
		'"anyOrigin"'
	],
	['--browser.navigator.userAgent=<value>', '', 'string', 'Sets the user agent.', ''],
	[
		'--browser.navigator.maxTouchPoints=<points>',
		'',
		'number',
		'Sets the maximum touch points.',
		'0'
	],
	[
		'--browser.device.prefersColorScheme=<value>',
		'',
		'string',
		'Sets the preferred color scheme.',
		'"light"'
	],
	[
		'--browser.device.prefersReducedMotion=<value>',
		'',
		'string',
		'Sets the preferred reduced motion.',
		'"no-preference"'
	],
	['--browser.device.mediaType=<type>', '', 'string', 'Sets the media type.', '"screen"'],
	['--browser.device.forcedColors=<value>', '', 'string', 'Sets the forced colors.', '"none"'],
	[
		'--browser.debug.traceWaitUntilComplete=<ms>',
		'',
		'number',
		'Throw an error with trace info about waitUntilComplete().',
		''
	]
];
