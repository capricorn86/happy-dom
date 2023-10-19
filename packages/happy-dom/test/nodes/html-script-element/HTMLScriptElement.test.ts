import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import IHTMLScriptElement from '../../../src/nodes/html-script-element/IHTMLScriptElement.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IResponse from '../../../src/fetch/types/IResponse.js';
import ResourceFetch from '../../../src/fetch/ResourceFetch.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Event from '../../../src/event/Event.js';
import IRequestInfo from '../../../src/fetch/types/IRequestInfo.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';

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
			const element = <IHTMLScriptElement>document.createElement('script');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});

		it('Loads and evaluates an external script when the attribute "src" is set and the element is connected to DOM.', async () => {
			const element = <IHTMLScriptElement>document.createElement('script');

			vi.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve(<IResponse>{
					text: async () => 'globalThis.test = "test";',
					ok: true,
					status: 200
				});
			});

			document.body.appendChild(element);

			element.async = true;
			element.src = 'test';

			await window.happyDOM.whenAsyncComplete();

			expect(window['test']).toBe('test');
		});

		it('Does not evaluate script if the element is not connected to DOM.', async () => {
			const element = <IHTMLScriptElement>document.createElement('script');

			vi.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve(<IResponse>{
					text: async () => 'globalThis.test = "test";',
					ok: true,
					status: 200
				});
			});

			element.async = true;
			element.src = 'test';

			await window.happyDOM.whenAsyncComplete();

			expect(window['test']).toBe(undefined);
		});
	});

	describe('get text()', () => {
		it('Returns the data of text nodes.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			expect(element.text).toBe('test');
		});

		it('Replaces all child nodes with a text node.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			element.text = 'test2';
			expect(element.text).toBe('test2');
		});
	});

	describe('set isConnected()', () => {
		it('Evaluates the text content as code when appended to an element that is connected to the document.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
			element.text = 'globalThis.test = "test";globalThis.currentScript = document.currentScript;';
			document.body.appendChild(element);
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(element);
		});

		it('Evaluates the text content as code when inserted before an element that is connected to the document.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
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

			vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo) => {
				fetchedURL = <string>url;
				return Promise.resolve(<IResponse>{
					text: async () =>
						'globalThis.test = "test";globalThis.currentScript = document.currentScript;',
					ok: true
				});
			});

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('load', (event) => {
				loadEvent = event;
			});

			document.body.appendChild(script);

			await window.happyDOM.whenAsyncComplete();

			expect((<Event>(<unknown>loadEvent)).target).toBe(script);
			expect(fetchedURL).toBe('path/to/script/');
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(script);
		});

		it('Triggers error event when loading external script asynchronously.', async () => {
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(window, 'fetch').mockImplementation((): Promise<IResponse> => {
				return Promise.resolve(<IResponse>(<unknown>{
					text: () => null,
					ok: false,
					status: 404
				}));
			});

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			await window.happyDOM.whenAsyncComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to perform request to "path/to/script/". Status code: 404'
			);
		});

		it('Loads external script synchronously with relative URL.', async () => {
			let fetchedDocument: IDocument | null = null;
			let fetchedURL: string | null = null;
			let loadEvent: Event | null = null;

			window.location.href = 'https://localhost:8080/base/';

			vi.spyOn(ResourceFetch, 'fetchSync').mockImplementation(
				(document: IDocument, url: string) => {
					fetchedDocument = document;
					fetchedURL = url;
					return 'globalThis.test = "test";globalThis.currentScript = document.currentScript;';
				}
			);

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('load', (event) => {
				loadEvent = event;
			});

			document.body.appendChild(script);

			expect((<Event>(<unknown>loadEvent)).target).toBe(script);
			expect(fetchedDocument).toBe(document);
			expect(fetchedURL).toBe('path/to/script/');
			expect(window['test']).toBe('test');
			expect(window['currentScript']).toBe(script);
		});

		it('Triggers error event when loading external script synchronously with relative URL.', () => {
			const thrownError = new Error('error');
			let errorEvent: ErrorEvent | null = null;

			window.location.href = 'https://localhost:8080/base/';

			vi.spyOn(ResourceFetch, 'fetchSync').mockImplementation(() => {
				throw thrownError;
			});

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('error');
			expect((<ErrorEvent>(<unknown>errorEvent)).error).toBe(thrownError);
		});

		it('Does not evaluate types that are not supported.', () => {
			const div = document.createElement('div');
			const element = <IHTMLScriptElement>document.createElement('script');
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
			const element = <IHTMLScriptElement>document.createElement('script');
			element.text = 'window.test = "test";';
			div.appendChild(element);
			expect(window['test']).toBe(undefined);
		});

		it('Evaluates the text content as code when using document.write().', () => {
			document.write('<script>globalThis.test = "test";</script>');
			expect(window['test']).toBe('test');
		});

		it('Evaluates the text content as code when using DOMParser.parseFromString().', () => {
			const domParser = new window.DOMParser();
			domParser.parseFromString('<script>globalThis.test = "test";</script>', 'text/html');
			expect(window['test']).toBe('test');
		});

		it('Loads and evaluates an external script when "src" attribute has been set, but does not evaluate text content.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');

			vi.spyOn(ResourceFetch, 'fetchSync').mockImplementation(
				() => 'globalThis.testFetch = "test";'
			);

			element.src = 'test';
			element.text = 'globalThis.testContent = "test";';

			document.body.appendChild(element);

			expect(window['testFetch']).toBe('test');
			expect(window['testContent']).toBe(undefined);
		});

		it('Does not load external scripts when "src" attribute has been set if the element is not connected to DOM.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');

			vi.spyOn(ResourceFetch, 'fetchSync').mockImplementation(
				() => 'globalThis.testFetch = "test";'
			);

			element.src = 'test';
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

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "path/to/script/". JavaScript file loading is disabled.'
			);
		});

		it('Triggers an error event when attempting to perform a synchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "path/to/script/". JavaScript file loading is disabled.'
			);
		});

		it('Triggers an error event when attempting to perform an asynchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "path/to/script/". JavaScript file loading is disabled.'
			);
		});

		it('Triggers an error event when attempting to perform a synchrounous request and the Happy DOM setting "disableJavaScriptFileLoading" is set to "true".', () => {
			window = new Window({
				settings: { disableJavaScriptFileLoading: true }
			});
			document = window.document;

			let errorEvent: ErrorEvent | null = null;

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external script "path/to/script/". JavaScript file loading is disabled.'
			);
		});

		it('Triggers an error event on Window when attempting to perform an asynchrounous request containing invalid JavaScript.', async () => {
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve(<IResponse>{
					text: async () => 'globalThis.test = /;',
					ok: true
				});
			});

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/base/path/to/script/';
			script.async = true;

			document.body.appendChild(script);

			await window.happyDOM.whenAsyncComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM.virtualConsolePrinter?.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Triggers an error event on Window when attempting to perform a synchrounous request containing invalid JavaScript.', () => {
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch, 'fetchSync').mockImplementation(() => 'globalThis.test = /;');

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			const script = <IHTMLScriptElement>window.document.createElement('script');
			script.src = 'https://localhost:8080/base/path/to/script/';

			document.body.appendChild(script);

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM.virtualConsolePrinter?.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Triggers an error event on Window when appending an element that contains invalid Javascript.', () => {
			const element = <IHTMLScriptElement>document.createElement('script');
			let errorEvent: ErrorEvent | null = null;

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			element.text = 'globalThis.test = /;';

			document.body.appendChild(element);

			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe(
				'Invalid regular expression: missing /'
			);

			const consoleOutput = window.happyDOM.virtualConsolePrinter?.readAsString() || '';
			expect(consoleOutput.startsWith('SyntaxError: Invalid regular expression: missing /')).toBe(
				true
			);
		});

		it('Throws an exception when appending an element that contains invalid Javascript and the Happy DOM setting "disableErrorCapturing" is set to true.', () => {
			window = new Window({
				settings: { disableErrorCapturing: true }
			});
			document = window.document;

			const element = <IHTMLScriptElement>document.createElement('script');

			element.text = 'globalThis.test = /;';

			expect(() => {
				document.body.appendChild(element);
			}).toThrow(new TypeError('Invalid regular expression: missing /'));
		});
	});
});
