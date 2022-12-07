import CSSStyleDeclaration from '../../src/css/declaration/CSSStyleDeclaration';
import IDocument from '../../src/nodes/document/IDocument';
import IHTMLLinkElement from '../../src/nodes/html-link-element/IHTMLLinkElement';
import IHTMLElement from '../../src/nodes/html-element/IHTMLElement';
import ResourceFetchHandler from '../../src/fetch/ResourceFetchHandler';
import IHTMLScriptElement from '../../src/nodes/html-script-element/IHTMLScriptElement';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import Navigator from '../../src/navigator/Navigator';
import Headers from '../../src/fetch/Headers';
import Selection from '../../src/selection/Selection';
import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import CustomElement from '../../test/CustomElement';
import { URL } from 'url';

describe('Window', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		mockedModules.reset();
		jest.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Is able to handle multiple instances of Window', () => {
			const secondWindow = new Window();
			const thirdWindow = new Window();

			for (const className of [
				'Response',
				'Request',
				'Image',
				'FileReader',
				'DOMParser',
				'Range'
			]) {
				const thirdInstance = new thirdWindow[className]();
				const firstInstance = new window[className]();
				const secondInstance = new secondWindow[className]();
				const property = className === 'Image' ? 'ownerDocument' : '_ownerDocument';

				expect(firstInstance[property] === window.document).toBe(true);
				expect(secondInstance[property] === secondWindow.document).toBe(true);
				expect(thirdInstance[property] === thirdWindow.document).toBe(true);
			}

			const thirdElement = thirdWindow.document.createElement('div');
			const firstElement = window.document.createElement('div');
			const secondElement = secondWindow.document.createElement('div');

			expect(firstElement.ownerDocument === window.document).toBe(true);
			expect(secondElement.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdElement.ownerDocument === thirdWindow.document).toBe(true);

			const thirdText = thirdWindow.document.createTextNode('Test');
			const firstText = window.document.createTextNode('Test');
			const secondText = secondWindow.document.createTextNode('Test');

			expect(firstText.ownerDocument === window.document).toBe(true);
			expect(secondText.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdText.ownerDocument === thirdWindow.document).toBe(true);

			const thirdComment = thirdWindow.document.createComment('Test');
			const firstComment = window.document.createComment('Test');
			const secondComment = secondWindow.document.createComment('Test');

			expect(firstComment.ownerDocument === window.document).toBe(true);
			expect(secondComment.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdComment.ownerDocument === thirdWindow.document).toBe(true);
		});

		it('Initializes by using given options', () => {
			const windowWithOptions = new Window({
				innerWidth: 1920,
				innerHeight: 1080,
				url: 'http://localhost:8080'
			});
			const windowWithoutOptions = new Window();

			expect(windowWithOptions.innerWidth).toBe(1920);
			expect(windowWithOptions.innerHeight).toBe(1080);
			expect(windowWithOptions.location.href).toBe('http://localhost:8080/');

			expect(windowWithoutOptions.innerWidth).toBe(1024);
			expect(windowWithoutOptions.innerHeight).toBe(768);
			expect(windowWithoutOptions.location.href).toBe('about:blank');
		});
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
			expect(window.Response.name).toBe('Response');
		});

		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles the "${method}" method with the async task manager.`, async () => {
				const response = new window.Response();
				const result = await response[method]();
				expect(result).toBe(mockedModules.modules['node-fetch'].returnValue.response[method]);
			});
		}
	});

	describe('get Request()', () => {
		it('Returns Request class.', () => {
			expect(window.Request['_ownerDocument']).toBe(document);
			expect(window.Request.name).toBe('Request');
		});

		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles the "${method}" method with the async task manager.`, async () => {
				const request = new window.Request('test');
				const result = await request[method]();
				expect(result).toBe(mockedModules.modules['node-fetch'].returnValue.response[method]);
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
		it('Handles default properties "display" and "direction".', () => {
			const element = <IHTMLElement>document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			window.document.body.appendChild(element);

			expect(computedStyle.direction).toBe('ltr');
			expect(computedStyle.display).toBe('block');
		});

		it('Returns a CSSStyleDeclaration object with computed styles that are live updated whenever the element styles are changed.', () => {
			const element = <IHTMLElement>document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			element.style.color = 'red';

			expect(computedStyle instanceof CSSStyleDeclaration).toBe(true);

			expect(computedStyle.color).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.color).toBe('red');

			element.style.color = 'green';

			expect(computedStyle.color).toBe('green');
		});

		it('Returns a CSSStyleDeclaration object with computed styles from style sheets.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setInnerWidth(1024);

			parentStyle.innerHTML = `
				div {
					font: 12px/1.5 "Helvetica Neue", Helvetica, Arial,sans-serif;
					color: red !important;
					cursor: pointer;
				}

				div span {
					border-radius: 1px !important;
                    direction: ltr;
				}

				.mySpan {
                    /* Should have higher priority because of the specifity of the rule */
                    direction: rtl;
				}

				@media (min-width: 1024px) {
					div {
						font-size: 14px;
					}
				}

				@media (max-width: 768px) {
					div {
						font-size: 20px;
					}
				}
			`;

			element.className = 'mySpan';
			elementStyle.innerHTML = `
				span {
					border: 1px solid #000;
					border-radius: 2px; 
					color: green;
					cursor: default;
                    direction: ltr;
				}
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.font).toBe('14px / 1.5 "Helvetica Neue", Helvetica, Arial, sans-serif');
			expect(computedStyle.border).toBe('1px solid #000');
			expect(computedStyle.borderRadius).toBe('1px');
			expect(computedStyle.color).toBe('red');
			expect(computedStyle.cursor).toBe('default');
			expect(computedStyle.direction).toBe('rtl');
		});

		it('Returns a CSSStyleDeclaration object with computed styles from style sheets for elements in a HTMLShadowRoot.', () => {
			const element = <IHTMLElement>document.createElement('span');
			const elementStyle = document.createElement('style');
			const customElement = <CustomElement>document.createElement('custom-element');
			const elementComputedStyle = window.getComputedStyle(element);

			elementStyle.innerHTML = `
				span {
					color: green;
				}
			`;

			document.body.appendChild(elementStyle);
			document.body.appendChild(element);
			document.body.appendChild(customElement);

			const customElementComputedStyle = window.getComputedStyle(
				customElement.shadowRoot.querySelector('span')
			);

			expect(elementComputedStyle.font).toBe('');
			expect(elementComputedStyle.color).toBe('green');

			expect(customElementComputedStyle.color).toBe('yellow');
			expect(customElementComputedStyle.font).toBe(
				'14px "Lucida Grande", Helvetica, Arial, sans-serif'
			);
		});

		it('Returns values defined by a CSS variables.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setInnerWidth(1024);

			parentStyle.innerHTML = `
				div {
					--color-variable: #000;
					--valid-variable: 1px solid var(--color-variable);
					--invalid-variable: invalid;
				}
			`;

			elementStyle.innerHTML = `
				span {
					border: var(--valid-variable);
					font: var(--invalid-variable);
				}
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.border).toBe('1px solid #000');
			expect(computedStyle.font).toBe('');
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

		it('Calls passed callback with current time', (done) => {
			window.requestAnimationFrame((now) => {
				expect(Math.abs(now - window.performance.now())).toBeLessThan(100);
				done();
			});
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
			window.happyDOM.setInnerWidth(1024);

			const mediaQueryString = '(max-width: 512px)';
			const mediaQueryList = window.matchMedia(mediaQueryString);
			expect(mediaQueryList.matches).toBe(false);
			expect(mediaQueryList.media).toBe(mediaQueryString);
			expect(mediaQueryList.onchange).toBe(null);

			expect(window.matchMedia('(max-width: 1024px)').matches).toBe(true);

			expect(typeof mediaQueryList.addEventListener).toBe('function');
			expect(typeof mediaQueryList.removeEventListener).toBe('function');
		});
	});

	describe('fetch()', () => {
		for (const method of ['arrayBuffer', 'blob', 'buffer', 'json', 'text', 'textConverted']) {
			it(`Handles successful "${method}" request.`, async () => {
				window.location.href = 'https://localhost:8080';
				document.cookie = 'name1=value1';
				document.cookie = 'name2=value2';

				const expectedUrl = 'https://localhost:8080/path/';
				const expectedOptions = {
					method: 'PUT',
					headers: {
						'test-header': 'test-value'
					}
				};
				const response = await window.fetch(expectedUrl, expectedOptions);
				const result = await response[method]();

				expect(mockedModules.modules['node-fetch'].parameters.init).toEqual({
					...expectedOptions,
					headers: {
						...expectedOptions.headers,
						'user-agent': window.navigator.userAgent,
						'set-cookie': 'name1=value1; name2=value2',
						referer: window.location.origin
					}
				});
				expect(mockedModules.modules['node-fetch'].parameters.url).toBe(expectedUrl);
				expect(result).toEqual(mockedModules.modules['node-fetch'].returnValue.response[method]);
			});
		}

		it('Handles relative URL.', async () => {
			const expectedPath = '/path/';

			window.location.href = 'https://localhost:8080';

			const response = await window.fetch(expectedPath);
			const textResponse = await response.text();

			expect(mockedModules.modules['node-fetch'].parameters.url).toBe(
				'https://localhost:8080' + expectedPath
			);

			expect(textResponse).toEqual(mockedModules.modules['node-fetch'].returnValue.response.text);
		});

		it('Handles URL object.', async () => {
			const expectedURL = 'https://localhost:8080/path/';

			window.location.href = 'https://localhost:8080';

			const response = await window.fetch(new URL(expectedURL));
			const textResponse = await response.text();

			expect(mockedModules.modules['node-fetch'].parameters.url).toBe(expectedURL);

			expect(textResponse).toEqual(mockedModules.modules['node-fetch'].returnValue.response.text);
		});

		it('Handles Request object with absolute URL.', async () => {
			const expectedURL = 'https://localhost:8080/path/';

			window.location.href = 'https://localhost:8080';

			const response = await window.fetch(new window.Request(expectedURL));
			const textResponse = await response.text();

			expect(mockedModules.modules['node-fetch'].parameters.url).toBe(expectedURL);

			expect(textResponse).toEqual(mockedModules.modules['node-fetch'].returnValue.response.text);
		});

		it('Handles Request object with relative URL.', async () => {
			const expectedPath = '/path/';

			window.location.href = 'https://localhost:8080';

			const response = await window.fetch(new window.Request(expectedPath));
			const textResponse = await response.text();

			expect(mockedModules.modules['node-fetch'].parameters.url).toBe(
				'https://localhost:8080' + expectedPath
			);

			expect(textResponse).toEqual(mockedModules.modules['node-fetch'].returnValue.response.text);
		});

		it('Handles error JSON request.', async () => {
			mockedModules.modules['node-fetch'].returnValue.error = new Error('error');
			window.location.href = 'https://localhost:8080';

			try {
				await window.fetch('/url/');
			} catch (error) {
				expect(error).toBe(mockedModules.modules['node-fetch'].returnValue.error);
			}
		});
	});

	describe('happyDOM.whenAsyncComplete()', () => {
		it('Resolves the Promise returned by whenAsyncComplete() when all async tasks has been completed.', async () => {
			window.location.href = 'https://localhost:8080';
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
			window.location.href = 'https://localhost:8080';
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

	describe('getSelection()', () => {
		it('Returns selection.', () => {
			expect(window.getSelection() instanceof Selection).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Triggers "load" event if no resources needs to be loaded.', (done) => {
			let loadEvent = null;

			window.addEventListener('load', (event) => {
				loadEvent = event;
			});

			setTimeout(() => {
				expect(loadEvent.target).toBe(document);
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
				expect(loadEvent.target).toBe(document);
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

	describe('atob()', () => {
		it('Decode "hello my happy dom!"', function () {
			const encoded = 'aGVsbG8gbXkgaGFwcHkgZG9tIQ==';
			const decoded = window.atob(encoded);
			expect(decoded).toBe('hello my happy dom!');
		});

		it('Decode Unicode (throw error)', function () {
			expect(() => {
				const data = '😄 hello my happy dom! 🐛';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded contains characters outside of the Latin1 range.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});

		it('Data not in base64list', function () {
			expect(() => {
				const data = '\x11GVsbG8gbXkgaGFwcHkgZG9tIQ==';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
		it('Data length not valid', function () {
			expect(() => {
				const data = 'aGVsbG8gbXkgaGFwcHkgZG9tI';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
	});

	describe('btoa()', () => {
		it('Encode "hello my happy dom!"', function () {
			const data = 'hello my happy dom!';
			const encoded = window.btoa(data);
			expect(encoded).toBe('aGVsbG8gbXkgaGFwcHkgZG9tIQ==');
		});

		it('Encode Unicode (throw error)', function () {
			expect(() => {
				const data = '😄 hello my happy dom! 🐛';
				window.btoa(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
	});
});
