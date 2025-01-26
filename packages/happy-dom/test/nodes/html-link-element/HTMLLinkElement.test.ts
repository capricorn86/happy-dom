import Window from '../../../src/window/Window.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLLinkElement from '../../../src/nodes/html-link-element/HTMLLinkElement.js';
import ResourceFetch from '../../../src/fetch/ResourceFetch.js';
import Event from '../../../src/event/Event.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import EventTarget from '../../../src/event/EventTarget.js';
import BrowserErrorCaptureEnum from '../../../src/browser/enums/BrowserErrorCaptureEnum.js';

describe('HTMLLinkElement', () => {
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
		it('Returns `[object HTMLLinkElement]`', () => {
			const element = document.createElement('link');
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLLinkElement]');
		});
	});

	for (const property of [
		'as',
		'crossOrigin',
		'href',
		'hreflang',
		'media',
		'referrerPolicy',
		'rel',
		'type'
	]) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('link');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('link');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe('get relList()', () => {
		it('Returns a DOMTokenList object.', () => {
			const element = document.createElement('link');
			element.setAttribute('rel', 'value1 value2');
			expect(element.relList.value).toBe('value1 value2');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = document.createElement('link');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			const element = document.createElement('link');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = document.createElement('link');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});

		it('Loads and evaluates an external CSS file when the attribute "href" and "rel" is set and the element is connected to DOM.', async () => {
			const element = document.createElement('link');
			const css = 'div { background: red; }';
			let loadedWindow: BrowserWindow | null = null;
			let loadedURL: string | null = null;
			let loadEvent: Event | null = null;
			let loadEventTarget: EventTarget | null = null;
			let loadEventCurrentTarget: EventTarget | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
				url: string | URL
			) {
				loadedWindow = this.window;
				loadedURL = <string>url;
				return css;
			});

			document.body.appendChild(element);

			element.addEventListener('load', (event) => {
				loadEvent = event;
				loadEventTarget = event.target;
				loadEventCurrentTarget = event.currentTarget;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';

			await window.happyDOM?.waitUntilComplete();

			expect(loadedWindow).toBe(window);
			expect(loadedURL).toBe('https://localhost:8080/test/path/file.css');
			expect(element.sheet.cssRules.length).toBe(1);
			expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
			expect((<Event>(<unknown>loadEvent)).target).toBe(element);
			expect(loadEventTarget).toBe(element);
			expect(loadEventCurrentTarget).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails during setting the "href" and "rel" attributes.', async () => {
			const element = document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function () {
				throw thrownError;
			});

			document.body.appendChild(element);

			element.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error).toEqual(thrownError);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toEqual('error');
		});

		it('Does not load and evaluate external CSS files if the element is not connected to DOM.', () => {
			const element = document.createElement('link');
			const css = 'div { background: red; }';
			let loadedWindow: BrowserWindow | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
				url: string | URL
			) {
				loadedWindow = this.window;
				loadedURL = <string>url;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';

			expect(loadedWindow).toBe(null);
			expect(loadedURL).toBe(null);
		});
	});

	describe('set isConnected()', () => {
		it('Loads and evaluates an external CSS file when "href" attribute has been set, but does not evaluate text content.', async () => {
			const element = document.createElement('link');
			const css = 'div { background: red; }';
			let loadEvent: Event | null = null;
			let loadEventTarget: EventTarget | null = null;
			let loadEventCurrentTarget: EventTarget | null = null;
			let loadedWindow: BrowserWindow | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
				url: string | URL
			) {
				loadedWindow = this.window;
				loadedURL = <string>url;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';
			element.addEventListener('load', (event) => {
				loadEvent = event;
				loadEventTarget = event.target;
				loadEventCurrentTarget = event.currentTarget;
			});

			document.body.appendChild(element);

			await window.happyDOM?.waitUntilComplete();

			expect(loadedWindow).toBe(window);
			expect(loadedURL).toBe('https://localhost:8080/test/path/file.css');
			expect(element.sheet.cssRules.length).toBe(1);
			expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
			expect((<Event>(<unknown>loadEvent)).target).toBe(element);
			expect(loadEventTarget).toBe(element);
			expect(loadEventCurrentTarget).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails while appending the element to the document.', async () => {
			const element = document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function () {
				throw thrownError;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';
			element.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(element);

			await window.happyDOM?.waitUntilComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error).toEqual(thrownError);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toEqual('error');
		});

		it('Does not load external CSS file when "href" attribute has been set if the element is not connected to DOM.', () => {
			const element = document.createElement('link');
			const css = 'div { background: red; }';
			let loadedWindow: BrowserWindow | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
				url: string | URL
			) {
				loadedWindow = this.window;
				loadedURL = <string>url;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';

			expect(loadedWindow).toBe(null);
			expect(loadedURL).toBe(null);
			expect(element.sheet).toBe(null);
		});

		it('Triggers an error event when the Happy DOM setting "disableCSSFileLoading" is set to "true".', async () => {
			window = new Window({
				settings: { disableCSSFileLoading: true }
			});
			document = window.document;

			const element = document.createElement('link');
			let errorEvent: ErrorEvent | null = null;

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';
			element.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			document.body.appendChild(element);

			expect(element.sheet).toBe(null);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external stylesheet "https://localhost:8080/test/path/file.css". CSS file loading is disabled.'
			);
		});

		it('Triggers a load event when the Happy DOM setting "disableCSSFileLoading" and "handleDisabledFileLoadingAsSuccess" is set to "true".', async () => {
			window = new Window({
				settings: { disableCSSFileLoading: true, handleDisabledFileLoadingAsSuccess: true }
			});
			document = window.document;

			const element = document.createElement('link');
			let loadEvent: Event | null = null;

			element.rel = 'stylesheet';
			element.href = 'https://localhost:8080/test/path/file.css';
			element.addEventListener('load', (event) => (loadEvent = <Event>event));

			document.body.appendChild(element);

			expect(element.sheet).toBe(null);
			expect((<Event>(<unknown>loadEvent)).type).toBe('load');
		});

		it('Preloads modules when "rel" is set to "modulepreload" and only fetches once when preload is ongoing', async () => {
			const requests: string[] = [];
			const window = new Window({
				url: 'https://localhost:8080/base/',
				settings: {
					errorCapture: BrowserErrorCaptureEnum.disabled,
					fetch: {
						interceptor: {
							afterAsyncResponse: async ({ request }) => {
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
			const link = document.createElement('link');

			link.rel = 'modulepreload';
			link.href = '/base/js/TestModuleElement.js';

			document.head.appendChild(link);

			const script = document.createElement('script');

			script.src = '/base/js/TestModuleElement.js';
			script.type = 'module';

			document.body.appendChild(script);

			await window.happyDOM?.waitUntilComplete();

			const testModule = document.createElement('test-module');

			document.body.appendChild(testModule);

			await window.happyDOM?.waitUntilComplete();

			expect(requests.sort()).toEqual([
				'https://localhost:8080/base/js/TestModuleElement.js',
				'https://localhost:8080/base/js/css/style.css',
				'https://localhost:8080/base/js/json/data.json',
				'https://localhost:8080/base/js/utilities/StringUtilityClass.js',
				'https://localhost:8080/base/js/utilities/apostrophWrapper.js',
				'https://localhost:8080/base/js/utilities/lazyload.js',
				'https://localhost:8080/base/js/utilities/stringUtility.js'
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
        </div><div>Lazy-loaded module: true</div>`);
		});
	});
});
