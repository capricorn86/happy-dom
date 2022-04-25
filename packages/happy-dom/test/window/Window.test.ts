import CSSStyleDeclaration from '../../src/css/CSSStyleDeclaration';
import IDocument from '../../src/nodes/document/IDocument';
import IHTMLLinkElement from '../../src/nodes/html-link-element/IHTMLLinkElement';
import IHTMLElement from '../../src/nodes/html-element/IHTMLElement';
import ResourceFetchHandler from '../../src/fetch/ResourceFetchHandler';
import IHTMLScriptElement from '../../src/nodes/html-script-element/IHTMLScriptElement';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import Navigator from '../../src/navigator/Navigator';
import Headers from '../../src/fetch/Headers';
import Response from '../../src/fetch/Response';
import Request from '../../src/fetch/Request';

const MOCKED_NODE_FETCH = global['mockedModules']['node-fetch'];

describe('Window', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		MOCKED_NODE_FETCH.url = null;
		MOCKED_NODE_FETCH.init = null;
		MOCKED_NODE_FETCH.error = null;
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get Object()', () => {
		it('Is not the same as {}.constructor when inside the VM.', () => {
			expect(typeof window.Object).toBe('function');
			expect({}.constructor).not.toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			expect(window.eval('({}).constructor === window.Object')).toBe(true);
		});
	});

	describe('get Function()', () => {
		it('Is not the same as (() => {}).constructorr when inside the VM.', () => {
			expect(typeof window.Function).toBe('function');
			expect((() => {}).constructor).not.toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			expect(window.eval('(() => {}).constructor === window.Function')).toBe(true);
		});
	});

	describe('get Array()', () => {
		it('Is not the same as [].constructorr when inside the VM.', () => {
			expect(typeof window.Array).toBe('function');
			expect([].constructor).not.toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			expect(window.eval('[].constructor === window.Array')).toBe(true);
		});
	});

	describe('get ArrayBuffer()', () => {
		it('Is defined.', () => {
			expect(typeof window.ArrayBuffer).toBe('function');
		});
	});

	describe('get Buffer()', () => {
		it('Is defined.', () => {
			expect(typeof window.Buffer).toBe('function');
		});
	});

	describe('get Headers()', () => {
		it('Returns Headers class.', () => {
			expect(window.Headers).toBe(Headers);
		});
	});

	describe('get Response()', () => {
		it('Returns Response class.', () => {
			expect(window.Response['_ownerDocument']).toBe(document);
			expect(window.Response).toBe(Response);
		});

		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles the "${method}" method with the async task manager.`, async () => {
				const response = new window.Response();
				const result = await response[method]();
				expect(result).toBe(MOCKED_NODE_FETCH.response[method]);
			});
		}
	});

	describe('get Request()', () => {
		it('Returns Request class.', () => {
			expect(window.Request['_ownerDocument']).toBe(document);
			expect(window.Request).toBe(Request);
		});

		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles the "${method}" method with the async task manager.`, async () => {
				const request = new window.Request('test');
				const result = await request[method]();
				expect(result).toBe(MOCKED_NODE_FETCH.response[method]);
			});
		}
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
			const element = <IHTMLElement>window.document.createElement('div');
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
		it('Sets a timeout.', (done) => {
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
		it('Sets an interval.', (done) => {
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
		it('Requests an animation frame.', (done) => {
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
		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles successful "${method}" request.`, async () => {
				const expectedUrl = 'https://localhost:8080/path/';
				const expectedOptions = {};

				const response = await window.fetch(expectedUrl, expectedOptions);
				const result = await response[method]();

				expect(MOCKED_NODE_FETCH.url).toBe(expectedUrl);
				expect(MOCKED_NODE_FETCH.init).toBe(expectedOptions);
				expect(result).toEqual(MOCKED_NODE_FETCH.response[method]);
			});
		}

		it('Handles relative URL.', async () => {
			const expectedPath = '/path/';
			const expectedOptions = {};

			window.location.href = 'https://localhost:8080';

			const response = await window.fetch(expectedPath, expectedOptions);
			const textResponse = await response.text();

			expect(MOCKED_NODE_FETCH.url).toBe('https://localhost:8080' + expectedPath);
			expect(MOCKED_NODE_FETCH.init).toBe(expectedOptions);
			expect(textResponse).toEqual(MOCKED_NODE_FETCH.response.text);
		});

		it('Handles error JSON request.', async () => {
			MOCKED_NODE_FETCH.error = new Error('error');

			try {
				await window.fetch('/url/', {});
			} catch (error) {
				expect(error).toBe(MOCKED_NODE_FETCH.error);
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
			window.fetch('/url/').then((response) =>
				response.json().then(() => {
					tasksDone++;
				})
			);
			window.fetch('/url/').then((response) =>
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
		it('Cancels all ongoing asynchrounous tasks.', (done) => {
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
				.then((response) =>
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
				.then((response) =>
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
		it('Triggers "load" event if no resources needs to be loaded.', (done) => {
			let loadEvent = null;

			window.addEventListener('load', (event) => {
				loadEvent = event;
			});

			setTimeout(() => {
				expect(loadEvent.target).toBe(window);
				done();
			}, 1);
		});

		it('Triggers "load" event when all resources have been loaded.', (done) => {
			const cssURL = '/path/to/file.css';
			const jsURL = '/path/to/file.js';
			const cssResponse = 'body { background-color: red; }';
			const jsResponse = 'globalThis.test = "test";';
			let resourceFetchCSSDocument = null;
			let resourceFetchCSSURL = null;
			let resourceFetchJSDocument = null;
			let resourceFetchJSURL = null;
			let loadEvent = null;

			jest
				.spyOn(ResourceFetchHandler, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					if (url.endsWith('.css')) {
						resourceFetchCSSDocument = document;
						resourceFetchCSSURL = url;
						return cssResponse;
					}

					resourceFetchJSDocument = document;
					resourceFetchJSURL = url;
					return jsResponse;
				});

			window.addEventListener('load', (event) => {
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
				expect(resourceFetchCSSDocument).toBe(document);
				expect(resourceFetchCSSURL).toBe(cssURL);
				expect(resourceFetchJSDocument).toBe(document);
				expect(resourceFetchJSURL).toBe(jsURL);
				expect(loadEvent.target).toBe(window);
				expect(document.styleSheets.length).toBe(1);
				expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

				expect(window['test']).toBe('test');

				done();
			}, 0);
		});

		it('Triggers "error" event if there are problems loading resources.', (done) => {
			const cssURL = '/path/to/file.css';
			const jsURL = '/path/to/file.js';
			const errorEvents = [];

			jest
				.spyOn(ResourceFetchHandler, 'fetch')
				.mockImplementation(async (_document: IDocument, url: string) => {
					throw new Error(url);
				});

			window.addEventListener('error', (event) => {
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
