import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLLinkElement from '../../../src/nodes/html-link-element/IHTMLLinkElement';
import ResourceFetch from '../../../src/fetch/ResourceFetch';
import ErrorEvent from '../../../src/event/events/ErrorEvent';

describe('HTMLLinkElement', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
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
			let loadedDocument = null;
			let loadedURL = null;
			let loadEvent = null;

			jest
				.spyOn(ResourceFetch, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				});

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
			expect(loadEvent.target).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails during setting the "href" and "rel" attributes.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent = null;

			jest.spyOn(ResourceFetch, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			document.body.appendChild(element);

			element.addEventListener('error', (event) => {
				errorEvent = event;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			await window.happyDOM.whenAsyncComplete();

			expect(errorEvent.error).toEqual(thrownError);
			expect(errorEvent.message).toEqual('error');
		});

		it('Does not load and evaluate external CSS files if the element is not connected to DOM.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedDocument = null;
			let loadedURL = null;

			jest
				.spyOn(ResourceFetch, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				});

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
			let loadEvent = null;
			let loadedDocument = null;
			let loadedURL = null;

			jest
				.spyOn(ResourceFetch, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				});

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
			expect(loadEvent.target).toBe(element);
		});

		it('Triggers error event when fetching a CSS file fails while appending the element to the document.', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent = null;

			jest.spyOn(ResourceFetch, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			element.rel = 'stylesheet';
			element.href = 'test';
			element.addEventListener('error', (event) => {
				errorEvent = event;
			});

			document.body.appendChild(element);

			await window.happyDOM.whenAsyncComplete();

			expect(errorEvent.error).toEqual(thrownError);
			expect(errorEvent.message).toEqual('error');
		});

		it('Does not load external CSS file when "href" attribute has been set if the element is not connected to DOM.', () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedDocument = null;
			let loadedURL = null;

			jest
				.spyOn(ResourceFetch, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					loadedDocument = document;
					loadedURL = url;
					return css;
				});

			element.rel = 'stylesheet';
			element.href = 'test';

			expect(loadedDocument).toBe(null);
			expect(loadedURL).toBe(null);
			expect(element.sheet).toBe(null);
		});

		it('Triggers an error event when "window.happyDOM.settings.disableCSSFileLoading" is set to "true".', async () => {
			const element = <IHTMLLinkElement>document.createElement('link');
			let errorEvent: ErrorEvent = null;

			element.rel = 'stylesheet';
			element.href = '/test/path/file.css';
			element.addEventListener('error', (event: ErrorEvent) => (errorEvent = event));

			window.happyDOM.settings.disableCSSFileLoading = true;

			document.body.appendChild(element);

			expect(element.sheet).toBe(null);
			expect(errorEvent.message).toBe(
				'Failed to load external stylesheet "/test/path/file.css". CSS file loading is disabled.'
			);
		});
	});
});
