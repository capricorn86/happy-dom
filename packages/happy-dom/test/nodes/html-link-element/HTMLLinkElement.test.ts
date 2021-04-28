import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLLinkElement from '../../../src/nodes/html-link-element/HTMLLinkElement';
import ResourceFetcher from '../../../src/fetch/ResourceFetcher';

describe('HTMLLinkElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
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
			test(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('link');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			test(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('link');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe('get href()', () => {
		test('Returns the "href" attribute.', () => {
			const element = <HTMLLinkElement>document.createElement('link');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('test');
		});
	});

	describe('set href()', () => {
		test('Sets the attribute "href".', () => {
			const element = <HTMLLinkElement>document.createElement('link');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});

		test('Loads and evaluates an external CSS file when the attribute "href" and "rel" is set and the element is connected to DOM.', done => {
			const element = <HTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedOptions = null;
			let loadEvent = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				loadedOptions = options;
				return css;
			});

			document.body.appendChild(element);

			element.addEventListener('load', event => {
				loadEvent = event;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			setTimeout(() => {
				expect(Object.keys(loadedOptions).length).toBe(2);
				expect(loadedOptions.window).toBe(window);
				expect(loadedOptions.url).toBe('test');
				expect(element.sheet.cssRules.length).toBe(1);
				expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
				expect(loadEvent.target).toBe(element);
				done();
			}, 0);
		});

		test('Triggers error event when fetching a CSS file fails during setting the "href" and "rel" attributes.', done => {
			const element = <HTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			document.body.appendChild(element);

			element.addEventListener('error', event => {
				errorEvent = event;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			setTimeout(() => {
				expect(errorEvent.error).toEqual(thrownError);
				expect(errorEvent.message).toEqual('error');
				done();
			}, 0);
		});

		test('Does not load and evaluate external CSS files if the element is not connected to DOM.', () => {
			const element = <HTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedOptions = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				loadedOptions = options;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			expect(loadedOptions).toBe(null);
		});
	});

	describe('set isConnected()', () => {
		test('Loads and evaluates an external script when "href" attribute has been set, but does not evaluate text content.', done => {
			const element = <HTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadEvent = null;
			let loadedOptions = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				loadedOptions = options;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'test';
			element.addEventListener('load', event => {
				loadEvent = event;
			});

			document.body.appendChild(element);

			setTimeout(() => {
				expect(Object.keys(loadedOptions).length).toBe(2);
				expect(loadedOptions.window).toBe(window);
				expect(loadedOptions.url).toBe('test');
				expect(element.sheet.cssRules.length).toBe(1);
				expect(element.sheet.cssRules[0].cssText).toBe('div { background: red; }');
				expect(loadEvent.target).toBe(element);
				done();
			}, 0);
		});

		test('Triggers error event when fetching a CSS file fails while appending the element to the document.', done => {
			const element = <HTMLLinkElement>document.createElement('link');
			const thrownError = new Error('error');
			let errorEvent = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async () => {
				throw thrownError;
			});

			element.rel = 'stylesheet';
			element.href = 'test';
			element.addEventListener('error', event => {
				errorEvent = event;
			});

			document.body.appendChild(element);

			setTimeout(() => {
				expect(errorEvent.error).toEqual(thrownError);
				expect(errorEvent.message).toEqual('error');
				done();
			}, 0);
		});

		test('Does not load external scripts when "href" attribute has been set if the element is not connected to DOM.', () => {
			const element = <HTMLLinkElement>document.createElement('link');
			const css = 'div { background: red; }';
			let loadedOptions = null;

			jest.spyOn(ResourceFetcher, 'fetch').mockImplementation(async options => {
				loadedOptions = options;
				return css;
			});

			element.rel = 'stylesheet';
			element.href = 'test';

			expect(loadedOptions).toBe(null);
			expect(element.sheet).toBe(null);
		});
	});
});
