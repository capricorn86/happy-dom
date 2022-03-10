import { Document, HTMLElement, IHTMLLinkElement } from '../../src';
import CSSStyleDeclaration from '../../src/css/CSSStyleDeclaration';
import ResourceFetcher from '../../src/fetch/ResourceFetcher';
import IHTMLScriptElement from '../../src/nodes/html-script-element/IHTMLScriptElement';
import IFetchOptions from '../../src/window/IFetchOptions';
import IResponse from '../../src/window/IResponse';
import Window from '../../src/window/Window';
import Navigator from '../../src/navigator/Navigator';

describe('Window', () => {
	let window: Window;
	let document: Document;
	let fetchedUrl: string;
	let fetchedOptions: IFetchOptions;
	let fetchResponseBody: string;
	let fetchError: Error;

	beforeAll(() => {
		jest.mock('node-fetch', () => (url: string, options: IFetchOptions) => {
			fetchedUrl = url;
			fetchedOptions = options;
			if (fetchError) {
				return Promise.reject(fetchError);
			}
			return <Promise<IResponse>>Promise.resolve({
				text: () => Promise.resolve(fetchResponseBody),
				json: () => Promise.resolve(JSON.parse(fetchResponseBody)),
				blob: () => Promise.resolve(null)
			});
		});
	});

	beforeEach(() => {
		fetchedUrl = null;
		fetchedOptions = null;
		fetchResponseBody = null;
		fetchError = null;
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get performance()', () => {
		it('Exposes "performance" from the NodeJS perf_hooks package.', () => {
			expect(typeof window.performance.now()).toBe('number');
		});
	});

	describe('get navigator()', () => {
		it('Returns an instance of Navigator with browser data.', () => {
			expect(window.navigator instanceof Navigator).toBe(true);
			expect(window.navigator).toEqual({
				appCodeName: 'Mozilla',
				appName: 'Netscape',
				appVersion: '5.0 (Windows)',
				cookieEnabled: true,
				credentials: null,
				doNotTrack: 'unspecified',
				geolocation: null,
				hardwareConcurrency: 8,
				language: 'en-US',
				languages: ['en-US', 'en'],
				locks: null,
				maxTouchPoints: 0,
				mimeTypes: {
					length: 0
				},
				onLine: true,
				permissions: null,
				platform: 'Win32',
				plugins: {
					length: 0
				},
				product: 'Gecko',
				productSub: '20100101',
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
				vendor: '',
				vendorSub: '',
				webdriver: true
			});
		});
	});

	describe('getComputedStyle()', () => {
		it('Returns a CSSStyleDeclaration object with computed styles that are live updated whenever the element styles are changed.', () => {
			const element = <HTMLElement>window.document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			element.style.direction = 'rtl';

			expect(computedStyle instanceof CSSStyleDeclaration).toBe(true);

			expect(computedStyle.direction).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.direction).toBe('rtl');
		});
	});

	describe('eval()', () => {
		it('Evaluates code and returns the result.', () => {
			const result = <() => number>window.eval('() => 5');
			expect(result()).toBe(5);
		});
	});

	describe('setTimeout()', () => {
		it('Sets a timeout.', done => {
			const timeoutId = window.setTimeout(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('clearTimeout()', () => {
		it('Clears a timeout.', () => {
			const timeoutId = window.setTimeout(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.clearTimeout(timeoutId);
		});
	});

	describe('setInterval()', () => {
		it('Sets an interval.', done => {
			let count = 0;
			const intervalId = window.setInterval(() => {
				count++;
				if (count > 2) {
					clearInterval(intervalId);
					done();
				}
			});
		});
	});

	describe('clearInterval()', () => {
		it('Clears an interval.', () => {
			const intervalId = window.setInterval(() => {
				throw new Error('This interval should have been canceled.');
			});
			window.clearInterval(intervalId);
		});
	});

	describe('requestAnimationFrame()', () => {
		it('Requests an animation frame.', done => {
			const timeoutId = window.requestAnimationFrame(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('cancelAnimationFrame()', () => {
		it('Cancels an animation frame.', () => {
			const timeoutId = window.requestAnimationFrame(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.cancelAnimationFrame(timeoutId);
		});
	});

	describe('matchMedia()', () => {
		it('Returns a new MediaQueryList object that can then be used to determine if the document matches the media query string.', () => {
			const mediaQueryString = '(max-width: 600px)';
			const mediaQueryList = window.matchMedia(mediaQueryString);
			expect(mediaQueryList.matches).toBe(false);
			expect(mediaQueryList.media).toBe(mediaQueryString);
			expect(mediaQueryList.onchange).toBe(null);
			expect(typeof mediaQueryList.addEventListener).toBe('function');
			expect(typeof mediaQueryList.removeEventListener).toBe('function');
		});
	});

	describe('fetch()', () => {
		it('Handles successful JSON request.', async () => {
			const expectedUrl = 'https://localhost:8080/path/';
			const expectedOptions = {};

			fetchResponseBody = '{}';

			const response = await window.fetch(expectedUrl, expectedOptions);
			const jsonResponse = await response.json();

			expect(fetchedUrl).toBe(expectedUrl);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(jsonResponse).toEqual({});
		});

		it('Handles successful Text request.', async () => {
			const expectedUrl = 'https://localhost:8080/path/';
			const expectedOptions = {};

			fetchResponseBody = 'text';

			const response = await window.fetch(expectedUrl, expectedOptions);
			const textResponse = await response.text();

			expect(fetchedUrl).toBe(expectedUrl);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(textResponse).toEqual(fetchResponseBody);
		});

		it('Handles relative URL.', async () => {
			const expectedPath = '/path/';
			const expectedOptions = {};

			window.location.href = 'https://localhost:8080';

			fetchResponseBody = 'text';

			const response = await window.fetch(expectedPath, expectedOptions);
			const textResponse = await response.text();

			expect(fetchedUrl).toBe('https://localhost:8080' + expectedPath);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(textResponse).toEqual(fetchResponseBody);
		});

		it('Handles error JSON request.', async () => {
			fetchError = new Error('error');

			try {
				await window.fetch('/url/', {});
			} catch (error) {
				expect(error).toBe(fetchError);
			}
		});
	});

	describe('happyDOM.whenAsyncComplete()', () => {
		it('Resolves the Promise returned by whenAsyncComplete() when all async tasks has been completed.', async () => {
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
				isFirstWhenAsyncCompleteCalled = true;
			});
			let tasksDone = 0;
			const intervalID = window.setInterval(() => {
				tasksDone++;
			});
			window.clearInterval(intervalID);
			window.setTimeout(() => {
				tasksDone++;
			});
			window.setTimeout(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.fetch('/url/').then(response =>
				response.json().then(() => {
					tasksDone++;
				})
			);
			window.fetch('/url/').then(response =>
				response.text().then(() => {
					tasksDone++;
				})
			);
			await window.happyDOM.whenAsyncComplete();
			expect(tasksDone).toBe(6);
			expect(isFirstWhenAsyncCompleteCalled).toBe(true);
		});
	});

	describe('happyDOM.cancelAsync()', () => {
		it('Cancels all ongoing asynchrounous tasks.', done => {
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
				isFirstWhenAsyncCompleteCalled = true;
			});
			let tasksDone = 0;
			const intervalID = window.setInterval(() => {
				tasksDone++;
			});
			window.clearInterval(intervalID);
			window.setTimeout(() => {
				tasksDone++;
			});
			window.setTimeout(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});

			window
				.fetch('/url/')
				.then(response =>
					response
						.json()
						.then(() => {
							tasksDone++;
						})
						.catch(() => {})
				)
				.catch(() => {});

			window
				.fetch('/url/')
				.then(response =>
					response
						.json()
						.then(() => {
							tasksDone++;
						})
						.catch(() => {})
				)
				.catch(() => {});

			let isSecondWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
				isSecondWhenAsyncCompleteCalled = true;
			});

			window.happyDOM.cancelAsync();

			expect(tasksDone).toBe(0);

			global.setTimeout(() => {
				expect(isFirstWhenAsyncCompleteCalled).toBe(true);
				expect(isSecondWhenAsyncCompleteCalled).toBe(true);
				done();
			}, 1);
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft.', () => {
				window[functionName](50, 60);
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			it('Sets the properties scrollTop and scrollLeft using object.', () => {
				window[functionName]({ left: 50, top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			it('Sets only the property scrollTop.', () => {
				window[functionName]({ top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			it('Sets only the property scrollLeft.', () => {
				window[functionName]({ left: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(60);
				expect(window.document.documentElement.scrollTop).toBe(0);
			});

			it('Sets the properties scrollTop and scrollLeft with animation.', async () => {
				window[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(0);
				await window.happyDOM.whenAsyncComplete();
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});
		});
	}

	describe('addEventListener()', () => {
		it('Triggers "load" event if no resources needs to be loaded.', done => {
			let loadEvent = null;

			window.addEventListener('load', event => {
				loadEvent = event;
			});

			setTimeout(() => {
				expect(loadEvent.target).toBe(window);
				done();
			}, 1);
		});

		it('Triggers "load" event when all resources have been loaded.', done => {
			const cssURL = '/path/to/file.css';
			const jsURL = '/path/to/file.js';
			const cssResponse = 'body { background-color: red; }';
			const jsResponse = 'global.test = "test";';
			let resourceFetchCSSOptions = null;
			let resourceFetchJSOptions = null;
			let loadEvent = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				if (options.url.endsWith('.css')) {
					resourceFetchCSSOptions = options;
					return cssResponse;
				}

				resourceFetchJSOptions = options;
				return jsResponse;
			});

			window.addEventListener('load', event => {
				loadEvent = event;
			});

			const script = <IHTMLScriptElement>document.createElement('script');
			script.async = true;
			script.src = jsURL;

			const link = <IHTMLLinkElement>document.createElement('link');
			link.href = cssURL;
			link.rel = 'stylesheet';

			document.body.appendChild(script);
			document.body.appendChild(link);

			setTimeout(() => {
				expect(resourceFetchCSSOptions.window).toBe(window);
				expect(resourceFetchCSSOptions.url).toBe(cssURL);
				expect(resourceFetchJSOptions.window).toBe(window);
				expect(resourceFetchJSOptions.url).toBe(jsURL);
				expect(loadEvent.target).toBe(window);
				expect(document.styleSheets.length).toBe(1);
				expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

				expect(global['test']).toBe('test');

				delete global['test'];

				done();
			}, 0);
		});

		it('Triggers "error" event if there are problems loading resources.', done => {
			const cssURL = '/path/to/file.css';
			const jsURL = '/path/to/file.js';
			const errorEvents = [];

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				throw new Error(options.url);
			});

			window.addEventListener('error', event => {
				errorEvents.push(event);
			});

			const script = <IHTMLScriptElement>document.createElement('script');
			script.async = true;
			script.src = jsURL;

			const link = <IHTMLLinkElement>document.createElement('link');
			link.href = cssURL;
			link.rel = 'stylesheet';

			document.body.appendChild(script);
			document.body.appendChild(link);

			setTimeout(() => {
				expect(errorEvents.length).toBe(2);
				expect(errorEvents[0].target).toBe(window);
				expect(errorEvents[0].error.message).toBe(jsURL);
				expect(errorEvents[1].target).toBe(window);
				expect(errorEvents[1].error.message).toBe(cssURL);

				done();
			}, 0);
		});
	});
});
