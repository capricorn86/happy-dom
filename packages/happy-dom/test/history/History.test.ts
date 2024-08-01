import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import History from '../../src/history/History.js';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import Fetch from '../../src/fetch/Fetch.js';
import Request from '../../src/fetch/Request';
import Response from '../../src/fetch/Response';

describe('History', () => {
	let browserFrame: IBrowserFrame;
	let history: History;

	beforeEach(() => {
		browserFrame = new Browser().newPage().mainFrame;
		history = new History(browserFrame, browserFrame.window);
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
			expect(history.length).toBe(3);
		});
	});

	describe('get state()', () => {
		it('Returns "null" if no state as been set.', () => {
			expect(history.state).toBe(null);
		});

		it('Returns the state if set by pushState().', () => {
			history.pushState({ key: 'value' }, '', '');
			expect(history.state).toEqual({ key: 'value' });
		});

		it('Returns the state if set by replaceState().', () => {
			history.replaceState({ key: 'value' }, '', '');
			expect(history.state).toEqual({ key: 'value' });
		});
	});

	describe('get scrollRestoration()', () => {
		it('Returns "auto" by default.', () => {
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		it('Returns set scroll restoration.', () => {
			history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.manual);
		});
	});

	describe('set scrollRestoration()', () => {
		it('Is not possible to set an invalid value.', () => {
			// @ts-ignore
			history.scrollRestoration = 'invalid';
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		it('Is possible to set to "manual".', () => {
			history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.manual);
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

			history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('about:blank');

			history.back();

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

			history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			history.back();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			history.forward();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			history.forward();

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');

			history.forward();

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

			history.go(-2);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.github.com/');

			history.go(1);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://www.example.com/');

			history.go(2);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');

			history.go(1);

			await browserFrame.waitForNavigation();

			expect(browserFrame.window.location.href).toBe('https://localhost:3000/');
		});
	});
});
