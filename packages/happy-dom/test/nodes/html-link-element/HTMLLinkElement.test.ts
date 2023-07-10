import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IHTMLLinkElement from '../../../src/nodes/html-link-element/IHTMLLinkElement.js';
import ResourceFetch from '../../../src/fetch/ResourceFetch.js';
import Event from '../../../src/event/Event.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('HTMLLinkElement', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLLinkElement]`', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
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
				const element = <IHTMLLinkElement>document.createElement('link');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = <IHTMLLinkElement>document.createElement('link');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe('get relList()', () => {
		it('Returns a DOMTokenList object.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			element.setAttribute('rel', 'value1 value2');
			expect(element.relList.value).toBe('value1 value2');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('test');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});

		it('Loads and evaluates an external CSS file when the attribute "href" and "rel" is set and the element is connected to DOM.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedDocument: IDocument | null = null;
			let loadedURL: string | null = null;
			let loadEvent: Event | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
				async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				}
			);

			document.body.appendChild(element);

			element.addEventListener('load', (event) => {
				loadEvent = event;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			await window.happyDOM.whenAsyncComplete();

			expect(loadedDocument).toBe(document);
			expect(loadedURL).toBe('test');
			expect(element.sheet.cssRules.length).toBe(1);
			expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
			expect((<Event>(<unknown>loadEvent)).target).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails during setting the "href" and "rel" attributes.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			document.body.appendChild(element);

			element.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			await window.happyDOM.whenAsyncComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error).toEqual(thrownError);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toEqual('error');
		});

		it('Does not load and evaluate external CSS files if the element is not connected to DOM.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedDocument: IDocument | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
				async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				}
			);

			element.rel = 'stylesheet';
			element.href = 'test';

			expect(loadedDocument).toBe(null);
			expect(loadedURL).toBe(null);
		});
	});

	describe('set isConnected()', () => {
		it('Loads and evaluates an external CSS file when "href" attribute has been set, but does not evaluate text content.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadEvent: Event | null = null;
			let loadedDocument: IDocument | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
				async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				}
			);

			element.rel = 'stylesheet';
			element.href = 'test';
			element.addEventListener('load', (event) => {
				loadEvent = event;
			});

			document.body.appendChild(element);

			await window.happyDOM.whenAsyncComplete();

			expect(loadedDocument).toBe(document);
			expect(loadedURL).toBe('test');
			expect(element.sheet.cssRules.length).toBe(1);
			expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
			expect((<Event>(<unknown>loadEvent)).target).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails while appending the element to the document.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent: ErrorEvent | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			element.rel = 'stylesheet';
			element.href = 'test';
			element.addEventListener('error', (event) => {
				errorEvent = <ErrorEvent>event;
			});

			document.body.appendChild(element);

			await window.happyDOM.whenAsyncComplete();

			expect((<ErrorEvent>(<unknown>errorEvent)).error).toEqual(thrownError);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toEqual('error');
		});

		it('Does not load external CSS file when "href" attribute has been set if the element is not connected to DOM.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedDocument: IDocument | null = null;
			let loadedURL: string | null = null;

			vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
				async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				}
			);

			element.rel = 'stylesheet';
			element.href = 'test';

			expect(loadedDocument).toBe(null);
			expect(loadedURL).toBe(null);
			expect(element.sheet).toBe(null);
		});

		it('Triggers an error event when "window.happyDOM.settings.disableCSSFileLoading" is set to "true".', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			let errorEvent: ErrorEvent | null = null;

			element.rel = 'stylesheet';
			element.href = '/test/path/file.css';
			element.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			window.happyDOM.settings.disableCSSFileLoading = true;

			document.body.appendChild(element);

			expect(element.sheet).toBe(null);
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe(
				'Failed to load external stylesheet "/test/path/file.css". CSS file loading is disabled.'
			);
		});
	});
});
