import Browser from '../../src/browser/Browser';
import BrowserContext from '../../src/browser/BrowserContext';
import BrowserPage from '../../src/browser/BrowserPage';
import DefaultBrowserSettings from '../../src/browser/DefaultBrowserSettings';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('Browser', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get contexts()', () => {
		it('Returns the contexts.', async () => {
			const browser = new Browser();
			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0]).toBe(browser.defaultContext);

			const incognitoContext = browser.newIncognitoContext();
			expect(browser.contexts.length).toBe(2);
			expect(browser.contexts[0]).toBe(browser.defaultContext);
			expect(browser.contexts[1]).toBe(incognitoContext);

			await incognitoContext.close();

			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0]).toBe(browser.defaultContext);

			await browser.defaultContext.close();

			expect(browser.contexts.length).toBe(0);
		});
	});

	describe('get settings()', () => {
		it('Returns the settings.', () => {
			expect(new Browser().settings).toEqual(DefaultBrowserSettings);
		});

		it('Returns the settings with custom settings.', () => {
			const settings = {
				disableJavaScriptEvaluation: true,
				navigator: {
					userAgent: 'test'
				}
			};
			expect(new Browser({ settings }).settings).toEqual({
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
			expect(new Browser().console).toBe(null);
		});

		it('Returns console sent into the constructor.', () => {
			expect(new Browser({ console }).console).toBe(console);
		});
	});

	describe('get defaultContext()', () => {
		it('Returns the default context.', () => {
			const browser = new Browser();
			expect(browser.defaultContext instanceof BrowserContext).toBe(true);
			expect(browser.contexts[0]).toBe(browser.defaultContext);
		});

		it('Throws an error if the browser has been closed.', async () => {
			const browser = new Browser();
			await browser.close();
			expect(() => browser.defaultContext).toThrow(
				'No default context. The browser has been closed.'
			);
		});
	});

	describe('close()', () => {
		it('Closes the browser.', async () => {
			const browser = new Browser();
			const originalClose = browser.defaultContext.close;
			let isContextClosed = false;

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
			const browser = new Browser();
			const page1 = browser.newPage();
			const page2 = browser.newPage();
			const page3 = browser.newIncognitoContext().newPage();
			page1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			page2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			page3.evaluate('setTimeout(() => { globalThis.test = 3; }, 10);');
			await browser.waitUntilComplete();
			expect(page1.mainFrame.window['test']).toBe(1);
			expect(page2.mainFrame.window['test']).toBe(2);
			expect(page3.mainFrame.window['test']).toBe(3);
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new Browser();
			const page1 = browser.newPage();
			const page2 = browser.newPage();
			const page3 = browser.newIncognitoContext().newPage();
			page1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			page2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			page3.evaluate('setTimeout(() => { globalThis.test = 3; }, 10);');
			browser.abort();
			await new Promise((resolve) => setTimeout(resolve, 50));
			expect(page1.mainFrame.window['test']).toBeUndefined();
			expect(page2.mainFrame.window['test']).toBeUndefined();
			expect(page3.mainFrame.window['test']).toBeUndefined();
		});
	});

	describe('newIncognitoContext()', () => {
		it('Creates a new incognito context.', () => {
			const browser = new Browser();
			const context = browser.newIncognitoContext();
			expect(context instanceof BrowserContext).toBe(true);
			expect(browser.contexts.length).toBe(2);
			expect(browser.contexts[1]).toBe(context);
		});

		it('Throws an error if the browser has been closed.', async () => {
			const browser = new Browser();
			await browser.close();
			expect(() => browser.newIncognitoContext()).toThrow(
				'No default context. The browser has been closed.'
			);
		});
	});

	describe('newPage()', () => {
		it('Creates a new page.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			expect(page instanceof BrowserPage).toBe(true);
			expect(browser.contexts.length).toBe(1);
			expect(browser.contexts[0].pages.length).toBe(1);
			expect(browser.contexts[0].pages[0]).toBe(page);
		});

		it('Throws an error if the browser has been closed.', async () => {
			const browser = new Browser();
			await browser.close();
			expect(() => browser.newPage()).toThrow('No default context. The browser has been closed.');
		});
	});
});
