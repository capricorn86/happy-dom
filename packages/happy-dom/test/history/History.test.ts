import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import Fetch from '../../src/fetch/Fetch.js';
import Request from '../../src/fetch/Request';
import Response from '../../src/fetch/Response';

describe('History', () => {
	let browserFrame: IBrowserFrame;

	beforeEach(() => {
		browserFrame = new Browser().newPage().mainFrame;
	});

	describe('get length()', () => {
		it('Returns the length of the page history.', () => {
			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example2',
				href: 'https://example2.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
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
		it('Navigates back in history', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			browserFrame[PropertySymbol.history].length = 0;

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'about:blank',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: true
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

			browserFrame[PropertySymbol.history].length = 0;

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'about:blank',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: true
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

			browserFrame[PropertySymbol.history].length = 0;

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'about:blank',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Github',
				href: 'https://www.github.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: 'Example',
				href: 'https://www.example.com',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: false
			});

			browserFrame[PropertySymbol.history].push({
				title: '',
				href: 'https://localhost:3000/',
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null,
				isCurrent: true
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

			expect(browserFrame[PropertySymbol.history]).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: false
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: true
				}
			]);
		});
	});

	describe('replaceState()', () => {
		it('Replaces the current state in the history.', () => {
			browserFrame.window.history.pushState({ key: 'value' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value' });

			expect(browserFrame[PropertySymbol.history]).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: false
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: true
				}
			]);

			browserFrame.window.history.replaceState({ key: 'value2' }, '', '');

			expect(browserFrame.window.history.state).toEqual({ key: 'value2' });

			expect(browserFrame[PropertySymbol.history]).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: false
				},
				{
					title: '',
					href: 'about:blank',
					state: { key: 'value2' },
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null,
					isCurrent: true
				}
			]);
		});
	});
});
