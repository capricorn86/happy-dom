import Browser from '../../src/browser/Browser.js';
import BrowserFrame from '../../src/browser/BrowserFrame.js';
import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import IGoToOptions from '../../src/browser/types/IGoToOptions.js';
import Response from '../../src/fetch/Response.js';
import Location from '../../src/location/Location.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import HashChangeEvent from '../../src/event/events/HashChangeEvent.js';

const HREF = 'https://google.com/some-path/?key=value&key2=value2#hash';

describe('Location', () => {
	let browserFrame: IBrowserFrame;

	beforeEach(() => {
		browserFrame = new BrowserFrame(new Browser().newPage());
	});

	describe('get hash()', () => {
		it('Returns the hash of the URL.', () => {
			const location = new Location(
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

			const location = new Location(
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

	describe('get host()', () => {
		it('Returns the host of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			expect(location.host).toBe('localhost:8080');
		});
	});

	describe('set host()', () => {
		it('Sets the host of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.host = 'localhost:8081';

			expect(<string>(<unknown>newURL)).toBe(
				'https://localhost:8081/some-path/?key=value&key2=value2#hash'
			);
		});
	});

	describe('get hostname()', () => {
		it('Returns the hostname of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			expect(location.hostname).toBe('localhost');
		});
	});

	describe('set hostname()', () => {
		it('Sets the hostname of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.hostname = 'localhost2';

			expect(<string>(<unknown>newURL)).toBe(
				'https://localhost2:8080/some-path/?key=value&key2=value2#hash'
			);
		});
	});

	describe('get href()', () => {
		it('Returns the URL.', () => {
			expect(new Location(browserFrame, 'about:blank').href).toBe('about:blank');
			expect(new Location(browserFrame, HREF).href).toBe(HREF);
		});
	});

	describe('set href()', () => {
		it('Calls browserFrame.goto() to navigate to the URL.', () => {
			const location = new Location(browserFrame, 'about:blank');
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<Response | null> => {
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
			const location = new Location(browserFrame, 'about:blank');

			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<Response | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.href = HREF;

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});
	});

	describe('get origin()', () => {
		it('Returns the origin of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
			expect(location.origin).toBe('https://localhost:8080');
		});
	});

	describe('get pathname()', () => {
		it('Returns the pathname of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
			expect(location.pathname).toBe('/some-path/');
		});
	});

	describe('set pathname()', () => {
		it('Sets the pathname of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.pathname = '/some-path2/';

			expect(<string>(<unknown>newURL)).toBe(
				'https://localhost:8080/some-path2/?key=value&key2=value2#hash'
			);
		});
	});

	describe('get port()', () => {
		it('Returns the port of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
			expect(location.port).toBe('8080');
		});
	});

	describe('set port()', () => {
		it('Sets the port of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.port = '8081';

			expect(<string>(<unknown>newURL)).toBe(
				'https://localhost:8081/some-path/?key=value&key2=value2#hash'
			);
		});
	});

	describe('get protocol()', () => {
		it('Returns the protocol of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
			expect(location.protocol).toBe('https:');
		});
	});

	describe('set protocol()', () => {
		it('Sets the protocol of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.protocol = 'http:';

			expect(<string>(<unknown>newURL)).toBe(
				'http://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
		});
	});

	describe('get search()', () => {
		it('Returns the search of the URL.', () => {
			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);
			expect(location.search).toBe('?key=value&key2=value2');
		});
	});

	describe('set search()', () => {
		it('Sets the search of the URL.', () => {
			let newURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(async (url: string) => {
				newURL = url;
				return null;
			});

			const location = new Location(
				browserFrame,
				'https://localhost:8080/some-path/?key=value&key2=value2#hash'
			);

			location.search = '?key3=value3';

			expect(<string>(<unknown>newURL)).toBe('https://localhost:8080/some-path/?key3=value3#hash');
		});
	});

	describe('replace()', () => {
		it('Calls browserFrame.goto() to navigate to the URL.', () => {
			const location = new Location(browserFrame, 'about:blank');
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<Response | null> => {
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
			const location = new Location(browserFrame, 'about:blank');

			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<Response | null> => {
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
			const location = new Location(browserFrame, 'about:blank');
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<Response | null> => {
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
			const location = new Location(browserFrame, 'about:blank');

			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<Response | null> => {
				return Promise.reject(new Error('Test error'));
			});

			location.assign(HREF);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browserFrame.page.virtualConsolePrinter.readAsString().startsWith('Error: Test error\n')
			).toBe(true);
		});

		it('Accepts url as URL object.', () => {
			const location = new Location(browserFrame, 'about:blank');
			let calledURL: string | null = null;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url: string): Promise<Response | null> => {
					calledURL = url;
					return null;
				}
			);

			location.assign(new URL(HREF));
			expect(calledURL).toBe(HREF);
		});
	});

	describe('reload()', () => {
		it('Reloads the page by calling browserFrame.goto() with the same URL.', () => {
			const location = new Location(browserFrame, 'about:blank');
			let calledURL: string | null = null;
			let calledOptions: IGoToOptions | undefined = undefined;

			vi.spyOn(browserFrame, 'goto').mockImplementation(
				async (url, options?: IGoToOptions): Promise<Response | null> => {
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
			const location = new Location(browserFrame, 'about:blank');

			vi.spyOn(browserFrame, 'goto').mockImplementation((): Promise<Response | null> => {
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
