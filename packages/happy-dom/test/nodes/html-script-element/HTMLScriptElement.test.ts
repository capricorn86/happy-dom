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

	for (const property of ['type', 'charset', 'lang']) {
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

	for (const property of ['async', 'defer']) {
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

		it('Loads external script asynchronously.', async () => {
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
			script.async = true;
			script.addEventListener('load', (event) => {
				loadEvent = event;
				loadEventTarget = event.target;
				loadEventCurrentTarget = event.currentTarget;
			});

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<Event>(<unknown>loadEvent)).target).toBe(null);
			expect(loadEventTarget).toBe(script);
			expect(loadEventCurrentTarget).toBe(script);
			expect(fetchedURL).toBe('https://localhost:8080/path/to/script.js');
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(script);
		});

		it('Triggers error event when loading external script asynchronously.', async () => {
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
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to perform request to "https://localhost:8080/path/to/script.js". Status 404 Not Found.'
			);
		});

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

			document.body.appendChild(script);

			expect((<Event>(<unknown>loadEvent)).target).toBe(null);
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
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetchSync').mockImplementation(() => {
				throw thrownError;
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script.js';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('error');
			expect((<ErrorEvent>(<unknown>errorEvent)).error).toBe(thrownError);
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

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
			);
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

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
			);
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

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
			);
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

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "https://localhost:8080/path/to/script.js". JavaScript file loading is disabled.'
			);
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
	});
});
