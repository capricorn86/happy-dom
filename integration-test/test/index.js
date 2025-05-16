await Promise.all([
	import('./tests/Fetch.test.js'),
	import('./tests/XMLHttpRequest.test.js'),
	import('./tests/WindowGlobals.test.js'),
	import('./tests/BrowserExceptionObserver.test.js'),
	import('./tests/Browser.test.js'),
	import('./tests/CommonJS.test.cjs')
]);
