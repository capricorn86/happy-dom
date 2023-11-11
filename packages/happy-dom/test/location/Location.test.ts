import Browser from '../../src/browser/Browser.js';
import BrowserFrame from '../../src/browser/BrowserFrame.js';
import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import IGoToOptions from '../../src/browser/types/IGoToOptions.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import Location from '../../src/location/Location.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';

const HREF = 'https://google.com/some-path/?key=value&key2=value2#hash';

describe('Location', () => {
	let browserFrame: IBrowserFrame;
	let location: Location;

	beforeEach(() => {
		browserFrame = new BrowserFrame(new Browser().newPage());
		location = new Location(browserFrame, 'about:blank');
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
	});
});
