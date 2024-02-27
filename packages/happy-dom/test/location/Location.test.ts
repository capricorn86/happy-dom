import Browser from '../../src/browser/Browser.js';
import BrowserFrame from '../../src/browser/BrowserFrame.js';
import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import IGoToOptions from '../../src/browser/types/IGoToOptions.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import Location from '../../src/location/Location.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import HashChangeEvent from '../../src/event/events/HashChangeEvent.js';

const HREF = 'https://google.com/some-path/?key=value&key2=value2#hash';

describe('Location', () => {
	let browserFrame: IBrowserFrame;
	let location: Location;

	beforeEach(() => {
		browserFrame = new BrowserFrame(new Browser().newPage());
		location = new Location(browserFrame, 'about:blank');
	});

	describe('get hash()', () => {
		it('Returns the hash of the URL.', () => {
			location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			expect(location.hash).toBe('#hash');
		});
	});

	describe('set hash()', () => {
		it('Sets the hash of the URL.', () => {
			const events: HashChangeEvent[] = [];

			browserFrame.window.addEventListener('hashchange', (event) => {
				events.push(<HashChangeEvent>event);
			});

			location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2'
			);

			location.hash = '#new-hash';

			expect(location.hash).toBe('#new-hash');
			expect(location.href).toBe(
				'https://localhost:8080/some-path/?key=value&key2=value2#new-hash'
			);

			location.hash = '#new-hash2';

			expect(location.hash).toBe('#new-hash2');
			expect(location.href).toBe(
				'https://localhost:8080/some-path/?key=value&key2=value2#new-hash2'
			);

			expect(events.length).toBe(2);
			expect(events[0].oldURL).toBe('https://localhost:8080/some-path/?key=value&key2=value2');
			expect(events[0].newURL).toBe(
				'https://localhost:8080/some-path/?key=value&key2=value2#new-hash'
			);
			expect(events[1].oldURL).toBe(
				'https://localhost:8080/some-path/?key=value&key2=value2#new-hash'
			);
			expect(events[1].newURL).toBe(
				'https://localhost:8080/some-path/?key=value&key2=value2#new-hash2'
			);
		});
	});

	describe('set href()', () => {
		it('Calls browserFrame.goto() to navigate to the URL.', () => {
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<IResponse | null> => {
					calledURL = url;
					calledOptions = options;
					return null;
				}
			);

			location.href = HREF;

			expect(calledURL).toBe(HREF);
			expect(calledOptions).toBeUndefined();
		});

		it('Handles promise rejections.', async () => {
			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<IResponse | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.href = HREF;

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});
	});

	describe('get href()', () => {
		it('Returns the URL.', () => {
			expect(location.href).toBe('about:blank');
			expect(new Location(browserFrame, HREF).href).toBe(HREF);
		});
	});

	describe('replace()', () => {
		it('Calls browserFrame.goto() to navigate to the URL.', () => {
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<IResponse | null> => {
					calledURL = url;
					calledOptions = options;
					return null;
				}
			);

			location.replace(HREF);

			expect(calledURL).toBe(HREF);
			expect(calledOptions).toBeUndefined();
		});

		it('Handles promise rejections.', async () => {
			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<IResponse | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.replace(HREF);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});
	});

	describe('assign()', () => {
		it('Calls browserFrame.goto() to navigate to the URL.', () => {
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<IResponse | null> => {
					calledURL = url;
					calledOptions = options;
					return null;
				}
			);

			location.assign(HREF);

			expect(calledURL).toBe(HREF);
			expect(calledOptions).toBeUndefined();
		});

		it('Handles promise rejections.', async () => {
			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<IResponse | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.assign(HREF);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});
	});

	describe('reload()', () => {
		it('Reloads the page by calling browserFrame.goto() with the same URL.', () => {
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<IResponse | null> => {
					calledURL = url;
					calledOptions = options;
					return null;
				}
			);

			location.reload();

			expect(calledURL).toBe('about:blank');
			expect(calledOptions).toBeUndefined();
		});

		it('Handles promise rejections.', async () => {
			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<IResponse | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.reload();

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});
	});
});
