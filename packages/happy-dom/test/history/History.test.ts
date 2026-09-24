import type IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import Window from '../../src/window/Window.js';
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
				href: 'https://example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].items.push({
				title: 'Example2',
				href: 'https://example2.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			// 3 as the first item is added as "about:blank" in the constructor.
			expect(browserFrame.window.history.length).toBe(3);
		});

		it('Increases when navigating with location.href.', async () => {
			const window = new Window({ url: 'https://www.example.com/' });

			expect(window.history.length).toBe(1);

			window.location.href = 'https://www.example.com/page2';

			// location.href setter calls goto() which is async
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(window.history.length).toBe(2);
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

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				popState: false,
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

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
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

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				popState: false,
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

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				popState: false,
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
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				}
			]);
		});
	});

	describe('replaceState()', () => {
		it('Replaces the current state in the history.', () => {
			browserFrame.window.history.pushState({ key: 'value' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value' });

			expect(browserFrame[PropertySymbol.history].items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				}
			]);

			browserFrame.window.history.replaceState({ key: 'value2' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value2' });

			expect(browserFrame[PropertySymbol.history].items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value2' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					popState: true,
					formData: null
				}
			]);
		});
	});
});
