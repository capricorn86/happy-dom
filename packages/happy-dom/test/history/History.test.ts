import type IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import Fetch from '../../src/fetch/Fetch.js';
import type Request from '../../src/fetch/Request';
import type Response from '../../src/fetch/Response';
import type PopStateEvent from '../../src/event/events/PopStateEvent.js';

describe('History', () => {
	let browserFrame: IBrowserFrame;

	beforeEach(() => {
		browserFrame = new Browser().newPage().mainFrame;
	});

	describe('get length()', () => {
		it('Returns the length of the page history.', () => {
			browserFrame[PropertySymbol.history].items.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].items.push({
				title: 'Example2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			// 3 as the first item is added as "about:blank" in the constructor.
			expect(browserFrame.window.history.length).toBe(3);
		});
	});

	describe('get state()', () => {
		it('Returns "null" if no state as been set.', () => {
			expect(browserFrame.window.history.state).toBe(null);
		});

		it('Returns the state if set by pushState().', () => {
			browserFrame.window.history.pushState({ key: 'value' }, '', '');
			expect(browserFrame.window.history.state).toEqual({ key: 'value' });
		});

		it('Returns the state if set by replaceState().', () => {
			browserFrame.window.history.replaceState({ key: 'value' }, '', '');
			expect(browserFrame.window.history.state).toEqual({ key: 'value' });
		});
	});

	describe('get scrollRestoration()', () => {
		it('Returns "auto" by default.', () => {
			expect(browserFrame.window.history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		it('Returns set scroll restoration.', () => {
			browserFrame.window.history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(browserFrame.window.history.scrollRestoration).toBe(
				HistoryScrollRestorationEnum.manual
			);
		});
	});

	describe('set scrollRestoration()', () => {
		it('Is not possible to set an invalid value.', () => {
			// @ts-ignore
			browserFrame.window.history.scrollRestoration = 'invalid';
			expect(browserFrame.window.history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		it('Is possible to set to "manual".', () => {
			browserFrame.window.history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(browserFrame.window.history.scrollRestoration).toBe(
				HistoryScrollRestorationEnum.manual
			);
		});
	});

	describe('back()', () => {
		it('Navigates back in history for navigated history items', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (this: any): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				url: 'https://www.github.com',
				navigationURL: 'https://www.github.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				url: 'https://www.example.com',
				navigationURL: 'https://www.example.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				url: 'https://localhost:3000/',
				navigationURL: 'https://localhost:3000/',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			browserFrame.window.history.back();
			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('about:blank');

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('about:blank');
		});

		it('Navigates back in history for pushed state', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (this: any): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame.goto('https://www.example.com/');

			await browserFrame.waitForNavigation();

			const popStates: Array<{ url: string; state: any }> = [];

			browserFrame.window.addEventListener('popstate', (event) => {
				popStates.push({
					url: browserFrame.window.location.href,
					state: (<PopStateEvent>event).state
				});
			});

			browserFrame.window.history.pushState(
				{ test: 'value' },
				null,
				'https://www.example.com/test/'
			);
			browserFrame.window.history.pushState(null, null, 'https://www.example.com/test2/');
			browserFrame.window.history.pushState(null, null, 'https://www.example.com/test3/');

			browserFrame.window.location.hash = '#test';

			browserFrame.window.history.back();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/test3/');
			expect(browserFrame.window.document.body.textContent).toBe('Test');

			browserFrame.window.history.back();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/test2/');
			expect(browserFrame.window.document.body.textContent).toBe('Test');

			browserFrame.window.history.back();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/test/');
			expect(browserFrame.window.document.body.textContent).toBe('Test');

			browserFrame.window.history.back();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');
			expect(browserFrame.window.document.body.textContent).toBe('Test');

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('about:blank');
			expect(browserFrame.window.document.body.textContent).toBe('');

			expect(popStates.length).toBe(4);
			expect(popStates[0].url).toBe('https://www.example.com/test3/');
			expect(popStates[0].state).toBe(null);
			expect(popStates[1].url).toBe('https://www.example.com/test2/');
			expect(popStates[1].state).toBe(null);
			expect(popStates[2].url).toBe('https://www.example.com/test/');
			expect(popStates[2].state).toEqual({ test: 'value' });
			expect(popStates[3].url).toBe('https://www.example.com/');
			expect(popStates[3].state).toBe(null);
		});
	});

	describe('forward()', () => {
		it('Navigates forward in history', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (this: any): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				url: 'https://www.github.com',
				navigationURL: 'https://www.github.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				url: 'https://www.example.com',
				navigationURL: 'https://www.example.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				url: 'https://localhost:3000/',
				navigationURL: 'https://localhost:3000/',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			browserFrame.window.history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			browserFrame.window.history.forward();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			browserFrame.window.history.forward();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');

			browserFrame.window.history.forward();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');
		});
	});

	describe('go()', () => {
		it('Navigates to a specific position in history', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (this: any): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				url: 'https://www.github.com',
				navigationURL: 'https://www.github.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				url: 'https://www.example.com',
				navigationURL: 'https://www.example.com',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				url: 'https://localhost:3000/',
				navigationURL: 'https://localhost:3000/',
				inheritOrigin: false,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame.window.history.go(-2);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			browserFrame.window.history.go(1);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			// Shouldn't navigate as there is no history item at this position.
			browserFrame.window.history.go(2);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			browserFrame.window.history.go(1);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');
		});
	});

	describe('pushState()', () => {
		it('Pushes a new state to the history.', () => {
			browserFrame.window.history.pushState({ key: 'value' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value' });

			expect(browserFrame[PropertySymbol.history].items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: '',
					url: 'about:blank',
					navigationURL: null,
					inheritOrigin: true,
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
		});
	});

	describe('replaceState()', () => {
		it('Passes down the source URL from the current history item.', () => {
			browserFrame.url = 'https://www.example.com/current/';
			browserFrame[PropertySymbol.history].currentItem.navigationURL = 'https://www.example.com/';

			browserFrame.window.history.replaceState({ key: 'value' }, '', '/test/');

			expect(browserFrame[PropertySymbol.history].currentItem.navigationURL).toBe(
				'https://www.example.com/'
			);
			expect(browserFrame[PropertySymbol.history].currentItem.url).toBe(
				'https://www.example.com/test/'
			);
		});

		it('Replaces the current state in the history.', () => {
			browserFrame.window.history.pushState({ key: 'value' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value' });

			expect(browserFrame[PropertySymbol.history].items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: '',
					url: 'about:blank',
					navigationURL: null,
					inheritOrigin: true,
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);

			browserFrame.window.history.replaceState({ key: 'value2' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value2' });

			expect(browserFrame[PropertySymbol.history].items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: '',
					url: 'about:blank',
					navigationURL: null,
					inheritOrigin: true,
					state: { key: 'value2' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
		});
	});

	for (const method of <Array<'pushState' | 'replaceState'>>['pushState', 'replaceState']) {
		describe(`${method}() URL validation`, () => {
			function expectRejectedURL(url: string): void {
				const window = browserFrame.window;
				const href = window.location.href;
				const length = window.history.length;
				const state = window.history.state;

				expect(() => window.history[method]({ rejected: true }, '', url)).toThrow(
					expect.objectContaining({ name: 'SecurityError', constructor: window.DOMException })
				);
				expect(window.location.href).toBe(href);
				expect(window.history.length).toBe(length);
				expect(window.history.state).toEqual(state);
			}

			it('Rejects JavaScript URLs without executing them during history traversal.', async () => {
				browserFrame.url = 'https://www.example.com/';
				browserFrame.window.history.pushState({ safe: true }, '', '/safe');
				const window = browserFrame.window;

				expectRejectedURL('javascript:document.title="executed"');

				await browserFrame.goBack();
				await browserFrame.goForward();

				expect(browserFrame.window).toBe(window);
				expect(window.location.href).toBe('https://www.example.com/safe');
				expect(window.history.state).toEqual({ safe: true });
				expect(window.document.title).toBe('');
			});

			it('Rejects JavaScript URLs with whitespace and mixed-case schemes.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL(' \tJaVaScRiPt:document.title="executed"');
			});

			it('Rejects data URLs from HTTP documents.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL('data:text/html,test');
			});

			it('Rejects about URLs from HTTP documents.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL('about:blank');
			});

			it('Rejects URLs from another origin.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL('https://www.other.com/');
				expectRejectedURL('http://www.example.com/');
				expectRejectedURL('https://www.example.com:8080/');
			});

			it('Rejects changes to URL credentials.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL('https://user:password@www.example.com/');
			});

			it('Rejects malformed URLs instead of falling back to about:blank.', () => {
				browserFrame.url = 'https://www.example.com/';
				expectRejectedURL('https://[');
			});

			it('Allows HTTP path, query and fragment changes.', () => {
				browserFrame.url = 'https://www.example.com/current/';

				browserFrame.window.history[method]({ key: 'value' }, '', '/other/?query#hash');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/other/?query#hash');
				expect(browserFrame.window.history.state).toEqual({ key: 'value' });
			});

			it('Resolves relative URLs against the document base URL.', () => {
				browserFrame.url = 'https://www.example.com/current/';
				browserFrame.window.document.head.innerHTML = '<base href="/base/">';

				browserFrame.window.history[method](null, '', 'other');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/base/other');
			});

			it('Rejects relative URLs resolved against a cross-origin base URL.', () => {
				browserFrame.url = 'https://www.example.com/';
				browserFrame.window.document.head.innerHTML = '<base href="https://www.other.com/">';

				expectRejectedURL('other');
			});

			it('Ignores an overridden document.baseURI getter.', () => {
				browserFrame.url = 'https://www.example.com/current/';
				const document = browserFrame.window.document;
				document.head.innerHTML = '<base href="/base/">';
				const getter = vi.fn(() => 'https://www.other.com/');
				Object.defineProperty(document, 'baseURI', { get: getter });

				browserFrame.window.history[method](null, '', 'other');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/base/other');
				expect(getter).not.toHaveBeenCalled();
				expectRejectedURL('javascript:document.title="executed"');
			});

			it('Ignores overridden base element and location getters.', () => {
				browserFrame.url = 'https://www.example.com/current/';
				const window = browserFrame.window;
				const location = window.location;
				window.document.head.innerHTML = '<base href="/base/">';
				const base = window.document.querySelector('base')!;
				const getter = vi.fn(() => 'https://www.other.com/');
				Object.defineProperty(base, 'href', { get: getter });
				Object.defineProperty(base, 'getAttribute', { value: getter });
				Object.defineProperty(window, 'location', { get: getter });
				Object.defineProperty(window.document, 'location', { get: getter });
				Object.defineProperty(window.document, 'querySelector', { value: getter });

				window.history[method](null, '', 'other');

				expect(location.href).toBe('https://www.example.com/base/other');
				expect(getter).not.toHaveBeenCalled();
			});

			it('Ignores an overridden window.URL constructor when validating URLs.', () => {
				browserFrame.url = 'https://www.example.com/';
				const constructor = vi.fn(() => ({
					protocol: 'https:',
					username: '',
					password: '',
					host: 'www.example.com',
					href: 'javascript:document.title="executed"'
				}));
				Object.defineProperty(browserFrame.window, 'URL', { value: constructor });

				expectRejectedURL('javascript:document.title="executed"');
				browserFrame.window.history[method](null, '', '/safe');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/safe');
				expect(constructor).not.toHaveBeenCalled();
			});

			it('Does not expose URL helpers or allow shadowing them to bypass validation.', () => {
				browserFrame.url = 'https://www.example.com/';
				const history = browserFrame.window.history;

				expect('getURL' in history).toBe(false);
				expect('getBaseHref' in history).toBe(false);

				const getURL = vi.fn(() => new URL('javascript:document.title="executed"'));
				const getBaseHref = vi.fn(() => 'https://www.other.com/');
				Object.defineProperty(history, 'getURL', { value: getURL });
				Object.defineProperty(history, 'getBaseHref', { value: getBaseHref });

				expectRejectedURL('javascript:document.title="executed"');
				history[method](null, '', '/safe');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/safe');
				expect(getURL).not.toHaveBeenCalled();
				expect(getBaseHref).not.toHaveBeenCalled();
			});

			it('Uses the first base element with an href attribute.', () => {
				browserFrame.url = 'https://www.example.com/';
				browserFrame.window.document.head.innerHTML =
					'<base target="_blank"><base href="/first/"><base href="/second/">';

				browserFrame.window.history[method](null, '', 'other');

				expect(browserFrame.window.location.href).toBe('https://www.example.com/first/other');
			});

			it('Allows about:blank fragment changes.', () => {
				browserFrame.window.history[method](null, '', 'about:blank#hash');

				expect(browserFrame.window.location.href).toBe('about:blank#hash');
			});

			it('Rejects scheme, path and query changes in about:blank documents.', () => {
				expectRejectedURL('javascript:document.title="executed"');
				expectRejectedURL('data:text/html,test');
				expectRejectedURL('about:srcdoc');
				expectRejectedURL('about:blank?query');
				expectRejectedURL('about:blank?');
			});

			it('Preserves inherited origin without allowing an about:blank iframe to rewrite its URL to HTTP.', async () => {
				browserFrame.page.context.browser.settings.enableIframePageLoading = true;
				browserFrame.url = 'https://www.example.com/';
				const parentWindow = browserFrame.window;
				const iframe = parentWindow.document.createElement('iframe');
				parentWindow.document.body.appendChild(iframe);

				await browserFrame.page.waitUntilComplete();

				browserFrame = browserFrame.childFrames[0];

				expectRejectedURL('https://www.example.com/');
				browserFrame.window.history[method](null, '', 'about:blank#hash');

				expect(browserFrame.window.location.href).toBe('about:blank#hash');
				expect(browserFrame.window.parent).toBe(parentWindow);
				expect(browserFrame.window.parent.document).toBe(parentWindow.document);
			});

			it('Allows data URL fragment changes.', () => {
				browserFrame.url = 'data:text/html,test';

				browserFrame.window.history[method](null, '', 'data:text/html,test#hash');

				expect(browserFrame.window.location.href).toBe('data:text/html,test#hash');
			});

			it('Rejects scheme, path and query changes in data documents.', () => {
				browserFrame.url = 'data:text/html,test';
				expectRejectedURL('javascript:document.title="executed"');
				expectRejectedURL('about:blank');
				expectRejectedURL('data:text/html,other');
				expectRejectedURL('data:text/html,test?query');
				expectRejectedURL('data:text/html,test?');
			});

			it('Allows file URL query and fragment changes.', () => {
				browserFrame.url = 'file:///path/to/file';

				browserFrame.window.history[method](null, '', 'file:///path/to/file?query#hash');

				expect(browserFrame.window.location.href).toBe('file:///path/to/file?query#hash');
			});

			it('Rejects file URL path changes.', () => {
				browserFrame.url = 'file:///path/to/file';
				expectRejectedURL('file:///path/to/other');
			});

			it('Allows blob URL fragment changes.', () => {
				browserFrame.url = 'blob:https://www.example.com/id';

				browserFrame.window.history[method](null, '', 'blob:https://www.example.com/id#hash');

				expect(browserFrame.window.location.href).toBe('blob:https://www.example.com/id#hash');
			});

			it('Rejects blob URL path and query changes.', () => {
				browserFrame.url = 'blob:https://www.example.com/id';
				expectRejectedURL('blob:https://www.example.com/other');
				expectRejectedURL('blob:https://www.example.com/id?query');
			});
		});
	}
});
