import Window from '../../../src/window/Window.js';
import HTMLScriptElement from '../../../src/nodes/html-script-element/HTMLScriptElement.js';
import Document from '../../../src/nodes/document/Document.js';
import Response from '../../../src/fetch/Response.js';
import ResourceFetch from '../../../src/fetch/ResourceFetch.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Event from '../../../src/event/Event.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Fetch from '../../../src/fetch/Fetch.js';
import BrowserErrorCaptureEnum from '../../../src/browser/enums/BrowserErrorCaptureEnum.js';
import EventTarget from '../../../src/event/EventTarget.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';

describe('HTMLScriptElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLScriptElement]`', () => {
			const element = document.createElement('script');
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLScriptElement]');
		});
	});

	for (const event of ['error', 'load']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				const element = document.createElement('script');
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				const element = document.createElement('script');
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	for (const property of ['type', 'charset', 'lang', 'crossOrigin', 'integrity']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('script');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('script');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	for (const property of ['async', 'defer', 'noModule']) {
		describe(`get ${property}()`, () => {
			it(`Returns "true" if the "${property}" attribute is defined.`, () => {
				const element = document.createElement('script');
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the "${property}" attribute to an empty string if set to "true".`, () => {
				const element = document.createElement('script');
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}

	describe('get blocking()', () => {
		it('Returns a DOMTokenList object.', () => {
			const element = document.createElement('script');
			element.setAttribute('blocking', 'value1 value2');
			expect(element.blocking).toBeInstanceOf(DOMTokenList);
			expect(element.blocking.value).toBe('value1 value2');
			expect(element.blocking.length).toBe(2);
			expect(element.blocking[0]).toBe('value1');
			expect(element.blocking[1]).toBe('value2');
		});
	});

	describe('set blocking()', () => {
		it('Sets the attribute "class".', () => {
			const element = document.createElement('script');
			element.blocking = 'value1 value2';
			expect(element.getAttribute('blocking')).toBe('value1 value2');
		});
	});

	describe('get fetchPriority()', () => {
		it('Returns valid fetch priority value.', () => {
			const element = document.createElement('script');

			expect(element.fetchPriority).toBe('auto');

			element.setAttribute('fetchpriority', 'high');
			expect(element.fetchPriority).toBe('high');

			element.setAttribute('fetchpriority', 'low');
			expect(element.fetchPriority).toBe('low');

			element.setAttribute('fetchpriority', 'normal');
			expect(element.fetchPriority).toBe('normal');

			element.setAttribute('fetchpriority', 'auto');
			expect(element.fetchPriority).toBe('auto');

			element.setAttribute('fetchpriority', 'invalid');
			expect(element.fetchPriority).toBe('auto');
		});
	});

	describe('set fetchPriority()', () => {
		it('Sets the attribute "fetchpriority".', () => {
			const element = document.createElement('script');

			element.fetchPriority = 'high';
			expect(element.getAttribute('fetchpriority')).toBe('high');

			element.fetchPriority = <'high'>'invalid';
			expect(element.getAttribute('fetchpriority')).toBe('invalid');
		});
	});

	describe('get referrerPolicy()', () => {
		it('Returns valid referrer policy value.', () => {
			const element = document.createElement('script');

			expect(element.referrerPolicy).toBe('');

			element.setAttribute('referrerpolicy', 'no-referrer');
			expect(element.referrerPolicy).toBe('no-referrer');

			element.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
			expect(element.referrerPolicy).toBe('no-referrer-when-downgrade');

			element.setAttribute('referrerpolicy', 'same-origin');
			expect(element.referrerPolicy).toBe('same-origin');

			element.setAttribute('referrerpolicy', 'origin');
			expect(element.referrerPolicy).toBe('origin');

			element.setAttribute('referrerpolicy', 'strict-origin');
			expect(element.referrerPolicy).toBe('strict-origin');

			element.setAttribute('referrerpolicy', 'origin-when-cross-origin');
			expect(element.referrerPolicy).toBe('origin-when-cross-origin');

			element.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
			expect(element.referrerPolicy).toBe('strict-origin-when-cross-origin');

			element.setAttribute('referrerpolicy', 'unsafe-url');
			expect(element.referrerPolicy).toBe('unsafe-url');

			element.setAttribute('referrerpolicy', 'invalid');
			expect(element.referrerPolicy).toBe('');
		});
	});

	describe('set referrerPolicy()', () => {
		it('Sets the attribute "referrerpolicy".', () => {
			const element = document.createElement('script');

			element.referrerPolicy = 'no-referrer';
			expect(element.getAttribute('referrerpolicy')).toBe('no-referrer');

			element.referrerPolicy = <'no-referrer'>'invalid';
			expect(element.getAttribute('referrerpolicy')).toBe('invalid');
		});
	});

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			const element = document.createElement('script');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			const element = document.createElement('script');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			const element = document.createElement('script');
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});

		it('Loads and evaluates an external script when the attribute "src" is set and the element is connected to DOM.', async () => {
			const element = document.createElement('script');

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(
				async () =>
					<Response>{
						text: async () => 'globalThis.test = "test";',
						ok: true,
						status: 200
					}
			);

			document.body.appendChild(element);

			element.async = true;
			element.src = 'https://localhost:8080/path/to/script.js';

			await window.happyDOM?.waitUntilComplete();

			expect(window['test']).toBe('test');
		});

		it('Does not evaluate script if the element is not connected to DOM.', async () => {
			const element = document.createElement('script');

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(
				async () =>
					<Response>{
						text: async () => 'globalThis.test = "test";',
						ok: true,
						status: 200
					}
			);

			element.async = true;
			element.src = 'https://localhost:8080/path/to/script.js';

			await window.happyDOM?.waitUntilComplete();

			expect(window['test']).toBe(undefined);
		});
	});

	describe('get text()', () => {
		it('Returns the data of text nodes.', () => {
			const element = document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			expect(element.text).toBe('test');
		});

		it('Replaces all child nodes with a text node.', () => {
			const element = document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			element.text = 'test2';
			expect(element.text).toBe('test2');
		});
	});

	describe('set isConnected()', () => {
		it('Evaluates the text content as code when appended to an element that is connected to the document.', () => {
			const element = document.createElement('script');
			element.text = 'globalThis.test = "test";globalThis.currentScript = document.currentScript;';
			document.body.appendChild(element);
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(element);
		});

		it('Evaluates the text content as code when inserted before an element that is connected to the document.', () => {
			const element = document.createElement('script');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');

			element.text = 'globalThis.test = "test";globalThis.currentScript = document.currentScript;';

			div1.appendChild(element);

			document.body.appendChild(div2);
			document.body.insertBefore(div1, div2);
			document.body.appendChild(element);

			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(element);
		});

		for (const attribute of [
			{ name: 'async', value: '' },
			{ name: 'defer', value: '' }
		]) {
			it(`Loads external script asynchronously when the attribute "${attribute.name}" is set to "${attribute.value}".`, async () => {
				let fetchedURL: string | null = null;
				let loadEvent: Event | null = null;
				let loadEventTarget: EventTarget | null = null;
				let loadEventCurrentTarget: EventTarget | null = null;

				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function () {
					fetchedURL = this.request.url;
					return <Response>{
						text: async () =>
							'globalThis.test = "test";globalThis.currentScript = document.currentScript;',
						ok: true
					};
				});

				const script = <HTMLScriptElement>window.document.createElement('script');
				script.src = 'https://localhost:8080/path/to/script.js';
				script.setAttribute(attribute.name, attribute.value);
				script.addEventListener('load', (event) => {
					loadEvent = event;
					loadEventTarget = event.target;
					loadEventCurrentTarget = event.currentTarget;
				});

				document.body.appendChild(script);

				await window.happyDOM?.waitUntilComplete();

				expect((<Event>(<unknown>loadEvent)).target).toBe(script);
				expect(loadEventTarget).toBe(script);
				expect(loadEventCurrentTarget).toBe(script);
				expect(fetchedURL).toBe('https://localhost:8080/path/to/script.js');
				expect(window['test']).toBe('test');
				expect(window['currentScript']).toBe(script);
			});

			it(`Triggers error event when loading external script asynchronously when the attribute "${attribute.name}" is set to "${attribute.value}".`, async () => {
				let errorEvent: ErrorEvent | null = null;

				vi.spyOn(Fetch.prototype, 'send').mockImplementation(
					async () => <Response>(<unknown>{
							text: () => null,
							ok: false,
							status: 404,
							statusText: 'Not Found'
						})
				);

				const script = <HTMLScriptElement>window.document.createElement('script');
				script.src = 'https://localhost:8080/path/to/script.js';
				script.setAttribute(attribute.name, attribute.value);
				script.addEventListener('error', (event) => {
					errorEvent = <ErrorEvent>event;
				});

				document.body.appendChild(script);

				await window.happyDOM?.waitUntilComplete();

				expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');

				expect(
					window.happyDOM?.virtualConsolePrinter
						.readAsString()
						.startsWith(
							'DOMException: Failed to perform request to "https://localhost:8080/path/to/script.js". Status 404 Not Found.'
						)
				).toBe(true);
			});
		}

		it('Loads external script synchronously with relative URL.', async () => {
			const window = new Window({ url: 'https://localhost:8080/base/' });
			let fetchedWindow: BrowserWindow | null = null;
			let fetchedURL: string | null = null;
			let loadEvent: Event | null = null;
			let loadEventTarget: EventTarget | null = null;
			let loadEventCurrentTarget: EventTarget | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(function (url: string) {
				fetchedWindow = this.window;
				fetchedURL = url;
				return 'globalThis.test = "test";globalThis.currentScript = document.currentScript;';
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script.js';
			script.addEventListener('load', (event) => {
				loadEvent = event;
				loadEventTarget = event.target;
				loadEventCurrentTarget = event.currentTarget;
			});

			window.document.body.appendChild(script);

			expect((<Event>(<unknown>loadEvent)).target).toBe(script);
			expect(loadEventTarget).toBe(script);
			expect(loadEventCurrentTarget).toBe(script);
			expect(fetchedWindow).toBe(window);
			expect(fetchedURL).toBe('https://localhost:8080/base/path/to/script.js');
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(script);
		});

		it('Triggers error event when loading external script synchronously with relative URL.', () => {
			const window = new Window({ url: 'https://localhost:8080/base/' });
			const thrownError = new Error('error');
			let errorEvent: Event | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(() => {
				throw thrownError;
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script.js';
			script.addEventListener('error', (event) => {
				errorEvent = <Event>event;
			});

			window.document.body.appendChild(script);

			expect((<Event>(<unknown>errorEvent)).type).toBe('error');

			expect(window.happyDOM?.virtualConsolePrinter.readAsString().startsWith('Error: error')).toBe(
				true
			);
		});

		it('Does not evaluate types that are not supported.', () => {
			const div = document.createElement('div');
			const element = document.createElement('script');
			element.type = 'application/json';
			element.textContent = '{"key": "value"}';
			div.appendChild(element);
			expect(element.textContent).toBe('{"key": "value"}');
		});

		it('Does not evaluate code when added as innerHTML.', () => {
			const div = document.createElement('div');
			div.innerHTML = '<script>globalThis.test = "test";</script>';
			document.body.appendChild(div);
			expect(window['test']).toBe(undefined);
		});

		it('Does not evaluate code when added as outerHTML.', () => {
			const div = document.createElement('div');
			document.body.appendChild(div);
			div.outerHTML = '<script>globalThis.test = "test";</script>';
			expect(window['test']).toBe(undefined);
		});

		it('Does not evaluate code if the element is not connected to DOM.', () => {
			const div = document.createElement('div');
			const element = document.createElement('script');
			element.text = 'window.test = "test";';
			div.appendChild(element);
			expect(window['test']).toBe(undefined);
		});

		it('Evaluates the text content as code when using document.write().', () => {
			document.write('<script>globalThis.test = "test";</script>');
			expect(window['test']).toBe('test');
		});

		it("Doesn't evaluate the text content as code when using DOMParser.parseFromString().", () => {
			const domParser = new window.DOMParser();
			const result = domParser.parseFromString(
				'<script>globalThis.test = "test";</script>',
				'text/html'
			);
			expect(window['test']).toBe(undefined);
			document.body.appendChild(result);
			expect(window['test']).toBe(undefined);
		});

		it('Loads and evaluates an external script when "src" attribute has been set, but does not evaluate text content.', () => {
			const element = document.createElement('script');

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(
				() => 'globalThis.testFetch = "test";'
			);

			element.src = 'https://localhost:8080/path/to/script.js';
			element.text = 'globalThis.testContent = "test";';

			document.body.appendChild(element);

			expect(window['testFetch']).toBe('test');
			expect(window['testContent']).toBe(undefined);
		});

		it('Does not load external scripts when "src" attribute has been set if the element is not connected to DOM.', () => {
			const element = document.createElement('script');

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(
				() => 'globalThis.testFetch = "test";'
			);

			element.src = 'https://localhost:8080/path/to/script.js';
			element.text = 'globalThis.test = "test";';

			expect(window['testFetch']).toBe(undefined);
			expect(window['testContent']).toBe(undefined);
		});

		it('Triggers an error event when attempting to perform an asynchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/path/to/script.js';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');

			expect(
				window.happyDOM?.virtualConsolePrinter
					.readAsString()
					.startsWith(
						'NotSupportedError: Failed to load script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
					)
			).toBe(true);
		});

		it('Triggers a load event when attempting to perform an asynchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" and "handleDisabledFileLoadingAsSuccess" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true, handleDisabledFileLoadingAsSuccess: true }
			});
			document = window.document;

			let loadEvent: Event | null = null;

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/path/to/script.js';
			script.async = true;
			script.addEventListener('load', (event) => {
				loadEvent = <Event>event;
			});

			document.body.appendChild(script);

			expect((<Event>(<unknown>loadEvent)).type).toBe('load');
		});

		it('Triggers an error event when attempting to perform a synchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/path/to/script.js';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');

			expect(
				window.happyDOM?.virtualConsolePrinter
					.readAsString()
					.startsWith(
						'NotSupportedError: Failed to load script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
					)
			).toBe(true);
		});

		it('Triggers an error event when attempting to perform an asynchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/path/to/script.js';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');

			expect(
				window.happyDOM?.virtualConsolePrinter
					.readAsString()
					.startsWith(
						'NotSupportedError: Failed to load script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
					)
			).toBe(true);
		});

		it('Triggers an error event when attempting to perform a synchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/path/to/script.js';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');
			expect(
				window.happyDOM?.virtualConsolePrinter
					.readAsString()
					.startsWith(
						'NotSupportedError: Failed to load script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
					)
			).toBe(true);
		});

		it('Triggers an error event on Window when attempting to perform an asynchrounous request containing invalid JavaScript.', async () => {
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(
				async () =>
					<Response>{
						text: async () => 'globalThis.test = /;',
						ok: true
					}
			);

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/base/path/to/script/';
			script.async = true;

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM?.virtualConsolePrinter.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Triggers an error event on Window when attempting to perform a synchrounous request containing invalid JavaScript.', () => {
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(
				() => 'globalThis.test = /;'
			);

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/base/path/to/script/';

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM?.virtualConsolePrinter.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Triggers an error event on Window when appending an element that contains invalid Javascript.', () => {
			const element = document.createElement('script');
			let errorEvent: ErrorEvent | null = null;

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			element.text = 'globalThis.test = /;';

			document.body.appendChild(element);

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM?.virtualConsolePrinter.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Throws an exception when appending an element that contains invalid Javascript and the Happy DOM setting "disableErrorCapturing" is set to true.', () => {
			window = new Window({
				settings: { disableErrorCapturing: true }
			});
			document = window.document;

			const element = document.createElement('script');

			element.text = 'globalThis.test = /;';

			expect(() => {
				document.body.appendChild(element);
			}).toThrow(new TypeError('Invalid regular expression: missing /'));
		});

		it('Throws an exception when appending an element that contains invalid Javascript and the Happy DOM setting "errorCapture" is set to "disabled".', () => {
			window = new Window({
				settings: { errorCapture: BrowserErrorCaptureEnum.disabled }
			});
			document = window.document;

			const element = document.createElement('script');

			element.text = 'globalThis.test = /;';

			expect(() => {
				document.body.appendChild(element);
			}).toThrow(new TypeError('Invalid regular expression: missing /'));
		});

		it('Handles loading of a modules.', async () => {
			const requests: string[] = [];
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					fetch: {
						interceptor: {
							beforeAsyncRequest: async ({ request }) => {
								requests.push(request.url);
							}
						},
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules/'
							}
						]
					}
				},
				console
			});
			const document = window.document;
			const script = document.createElement('script');
			let modulesLoadedAfterLoadEvent: string[] | null = null;

			script.src = 'https://localhost:8080/base/js/TestModuleElement.js';
			script.type = 'module';
			script.addEventListener('load', () => {
				modulesLoadedAfterLoadEvent = window['moduleLoadOrder'].slice();
			});

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			const testModule = document.createElement('test-module');

			document.body.appendChild(testModule);

			await window.happyDOM?.waitUntilComplete();

			expect(requests).toEqual([
				'https://localhost:8080/base/js/TestModuleElement.js',
				'https://localhost:8080/base/js/utilities/StringUtilityClass.js',
				'https://localhost:8080/base/js/utilities/stringUtility.js',
				'https://localhost:8080/base/js/json/data.json',
				'https://localhost:8080/base/js/css/style.css',
				'https://localhost:8080/base/js/utilities/apostrophWrapper.js',
				'https://localhost:8080/base/js/utilities/lazyload.js'
			]);

			expect(window['moduleLoadOrder']).toEqual([
				'apostrophWrapper.js',
				'StringUtilityClass.js',
				'stringUtility.js',
				'TestModuleElement.js',
				'lazyload.js'
			]);

			expect(modulesLoadedAfterLoadEvent).toEqual([
				'apostrophWrapper.js',
				'StringUtilityClass.js',
				'stringUtility.js',
				'TestModuleElement.js'
			]);

			expect(testModule.shadowRoot?.innerHTML).toBe(`<div>
            Expect lower case: "value"
            Expect upper case: "VALUE"
            Expect lower case. "value"
            Expect trimmed lower case: "value"
        </div><div>Lazy-loaded module: true</div>`);

			expect(testModule.shadowRoot?.adoptedStyleSheets[0].cssRules[0].cssText).toBe(
				'div { background: red; }'
			);
			expect(
				window.getComputedStyle(<HTMLElement>testModule.shadowRoot?.querySelector('div'))
					.backgroundColor
			).toBe('red');
		});

		it('Handles modules using an import map.', async () => {
			const requests: string[] = [];
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					fetch: {
						interceptor: {
							beforeAsyncRequest: async ({ request }) => {
								requests.push(request.url);
							}
						},
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules-with-import-map/default/'
							},
							{
								url: 'https://external-scripts.com/js/',
								directory:
									'./test/nodes/html-script-element/modules-with-import-map/external-scripts/'
							},
							{
								url: 'https://external-resources.com/',
								directory:
									'./test/nodes/html-script-element/modules-with-import-map/external-resources/'
							}
						]
					}
				},
				console
			});
			const document = window.document;
			const importMap = document.createElement('script');

			importMap.type = 'importmap';
			importMap.textContent = JSON.stringify({
				imports: {
					'external-scripts/': 'https://external-scripts.com/js/'
				},
				scopes: {
					'base/': {
						'external-resources/': 'https://external-resources.com/'
					},
					'https://external-scripts.com': {
						'second-external-resources/': 'https://external-resources.com/'
					},
					'invalid/': {
						'external-resources/': 'https://wrong.com'
					}
				}
			});

			document.body.appendChild(importMap);

			const script = document.createElement('script');

			script.src = '/base/js/TestModuleElement.js';
			script.type = 'module';

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			const testModule = document.createElement('test-module');

			document.body.appendChild(testModule);

			await window.happyDOM?.waitUntilComplete();

			expect(requests).toEqual([
				'https://localhost:8080/base/js/TestModuleElement.js',
				'https://localhost:8080/base/js/utilities/StringUtilityClass.js',
				'https://external-scripts.com/js/utilities/stringUtility.js',
				'https://external-resources.com/json/data.json',
				'https://external-resources.com/css/style.css',
				'https://external-scripts.com/js/utilities/apostrophWrapper.js',
				'https://localhost:8080/base/js/utilities/lazyload.js'
			]);

			expect(window['moduleLoadOrder']).toEqual([
				'apostrophWrapper.js',
				'StringUtilityClass.js',
				'stringUtility.js',
				'TestModuleElement.js',
				'lazyload.js'
			]);

			expect(testModule.shadowRoot?.innerHTML).toBe(`<div>
            Expect lower case: "value"
            Expect upper case: "VALUE"
            Expect lower case. "value"
            Expect trimmed lower case: "value"
            Additional expect lower case. "value"
        </div><div>Lazy-loaded module: true</div>`);

			expect(testModule.shadowRoot?.adoptedStyleSheets[0].cssRules[0].cssText).toBe(
				'div { background: red; }'
			);
			expect(
				window.getComputedStyle(<HTMLElement>testModule.shadowRoot?.querySelector('div'))
					.backgroundColor
			).toBe('red');
		});

		it('Dispatches "error" event on script element when a module is not found', async () => {
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules-with-not-found-error/'
							}
						]
					}
				}
			});
			const document = window.document;

			const script = document.createElement('script');
			let errorEvent: Event | null = null;

			script.src = '/base/js/TestModuleElement.js';
			script.type = 'module';
			script.addEventListener('error', (event) => {
				errorEvent = event;
			});

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');
			expect((<ErrorEvent>(<unknown>errorEvent)).bubbles).toBe(false);
			expect(
				window.happyDOM?.virtualConsolePrinter.readAsString().startsWith(
					`GET https://localhost:8080/base/js/utilities/notFound.js 404 (Not Found)
DOMException: Failed to perform request to "https://localhost:8080/base/js/utilities/notFound.js". Status 404 Not Found.`
				)
			).toBe(true);
		});

		it('Dispatches "error" event on Window when compilation of module failed', async () => {
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules-with-compilation-error/'
							}
						]
					}
				}
			});
			const document = window.document;
			let errorEvent: Event | null = null;

			window.addEventListener('error', (event) => {
				errorEvent = event;
			});

			const script = document.createElement('script');

			script.src = '/base/js/TestModuleElement.js';
			script.type = 'module';

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');
			expect((<ErrorEvent>(<unknown>errorEvent)).bubbles).toBe(false);
			expect(
				window.happyDOM?.virtualConsolePrinter
					.readAsString()
					.startsWith(
						`SyntaxError: Failed to parse module 'https://localhost:8080/base/js/utilities/stringUtility.js': Unexpected token 'export'`
					)
			).toBe(true);
		});

		it('Dispatches "error" event on Window when evaluation of module failed', async () => {
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules-with-evaluation-error/'
							}
						]
					}
				}
			});
			const document = window.document;
			let errorEvent: Event | null = null;

			window.addEventListener('error', (event) => {
				errorEvent = event;
			});

			const script = document.createElement('script');

			script.src = '/base/js/TestModuleElement.js';
			script.type = 'module';

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).type).toBe('error');
			expect((<ErrorEvent>(<unknown>errorEvent)).bubbles).toBe(false);
			expect(
				window.happyDOM?.virtualConsolePrinter.readAsString()
					.startsWith(`ReferenceError: notFound is not defined
    at eval (https://localhost:8080/base/js/utilities/stringUtility.js:12:14)`)
			).toBe(true);
		});
	});

	describe('static supports()', () => {
		it('Returns true for supported types.', () => {
			expect(window.HTMLScriptElement.supports('classic')).toBe(true);
			expect(window.HTMLScriptElement.supports('module')).toBe(true);
			expect(window.HTMLScriptElement.supports('importmap')).toBe(true);

			expect(window.HTMLScriptElement.supports('speculationrules')).toBe(false);
			expect(window.HTMLScriptElement.supports('text/javascript')).toBe(false);
			expect(window.HTMLScriptElement.supports('invalid')).toBe(false);
		});
	});
});
