import DetachedBrowser from '../../../src/browser/detached-browser/DetachedBrowser';
import DetachedBrowserContext from '../../../src/browser/detached-browser/DetachedBrowserContext';
import DetachedBrowserPage from '../../../src/browser/detached-browser/DetachedBrowserPage';
import DefaultBrowserSettings from '../../../src/browser/DefaultBrowserSettings';
import BrowserWindow from '../../../src/window/BrowserWindow';
import Window from '../../../src/window/Window';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('DetachedBrowser', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get contexts()', () => {
		it('Returns the contexts.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);

			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0]).toBe(browser.defaultContext);

			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0]).toBe(browser.defaultContext);

			await browser.defaultContext.close();

			expect(browser.contexts.length).toBe(0);
		});
	});

	describe('get settings()', () => {
		it('Returns the settings.', () => {
			expect(new DetachedBrowser(BrowserWindow).settings).toEqual(DefaultBrowserSettings);
		});

		it('Returns the settings with custom settings.', () => {
			const settings = {
				disableJavaScriptEvaluation: true,
				navigator: {
					userAgent: 'test'
				}
			};
			expect(new DetachedBrowser(BrowserWindow, { settings }).settings).toEqual({
				...DefaultBrowserSettings,
				...settings,
				navigator: {
					...DefaultBrowserSettings.navigator,
					...settings.navigator
				}
			});
		});
	});

	describe('get console()', () => {
		it('Returns "null" if no console is provided.', () => {
			expect(new DetachedBrowser(BrowserWindow).console).toBe(null);
		});

		it('Returns console sent into the constructor.', () => {
			expect(new DetachedBrowser(BrowserWindow, { console }).console).toBe(console);
		});
	});

	describe('get defaultContext()', () => {
		it('Returns the default context.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			expect(browser.defaultContext instanceof DetachedBrowserContext).toBe(true);
			expect(browser.contexts[0]).toBe(browser.defaultContext);
		});

		it('Throws an error if the browser has been closed.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			await browser.close();
			expect(() => browser.defaultContext).toThrow(
				'No default context. The browser has been closed.'
			);
		});
	});

	describe('close()', () => {
		it('Closes the browser.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const originalClose = browser.defaultContext.close;
			let isContextClosed = false;

			browser.defaultContext.pages[0].mainFrame.window = new Window();

			vi.spyOn(browser.defaultContext, 'close').mockImplementation(() => {
				isContextClosed = true;
				return originalClose.call(browser.defaultContext);
			});

			await browser.close();
			expect(browser.contexts.length).toBe(0);
			expect(isContextClosed).toBe(true);
		});
	});

	describe('waitUntilComplete()', () => {
		it('Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page1 = browser.newPage();
			const page2 = browser.newPage();
			page1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			page2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			await browser.waitUntilComplete();
			expect(page1.mainFrame.window['test']).toBe(1);
			expect(page2.mainFrame.window['test']).toBe(2);
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page1 = browser.newPage();
			const page2 = browser.newPage();
			page1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			page2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			browser.abort();
			await new Promise((resolve) => setTimeout(resolve, 30));
			expect(page1.mainFrame.window['test']).toBeUndefined();
			expect(page2.mainFrame.window['test']).toBeUndefined();
		});
	});

	describe('newIncognitoContext()', () => {
		it('Throws an error as it is not possible to create a new incognito context inside a detached browser.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			await browser.close();
			expect(() => browser.newIncognitoContext()).toThrow(
				'Not possible to create a new context on a detached browser.'
			);
		});
	});

	describe('newPage()', () => {
		it('Creates a new page.', () => {
			const window = new Window();
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = window;
			const page = browser.newPage();
			expect(page instanceof DetachedBrowserPage).toBe(true);
			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0].pages.length).toBe(2);
			expect(browser.contexts[0].pages[0].mainFrame.window).toBe(window);
			expect(browser.contexts[0].pages[1]).toBe(page);
		});

		it('Throws an error if the browser has been closed.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			await browser.close();
			expect(() => browser.newPage()).toThrow('No default context. The browser has been closed.');
		});
	});
});
