import DetachedBrowser from '../../../src/browser/detached-browser/DetachedBrowser';
import DetachedBrowserPage from '../../../src/browser/detached-browser/DetachedBrowserPage';
import Window from '../../../src/window/Window';
import BrowserWindow from '../../../src/window/BrowserWindow';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('DetachedBrowserContext', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get pages()', () => {
		it('Returns the pages.', () => {
			const window = new Window();
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = window;
			expect(browser.defaultContext.pages.length).toBe(1);
			expect(browser.defaultContext.pages[0].mainFrame.window).toBe(window);
			const page = browser.defaultContext.newPage();
			expect(browser.defaultContext.pages.length).toBe(2);
			expect(browser.defaultContext.pages[0].mainFrame.window).toBe(window);
			expect(browser.defaultContext.pages[1]).toBe(page);
		});
	});

	describe('get browser()', () => {
		it('Returns the browser.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			expect(browser.defaultContext.browser).toBe(browser);
		});
	});

	describe('get closed()', () => {
		it('Returns "false" if the context is not closed.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			expect(browser.defaultContext.closed).toBe(false);
		});

		it('Returns "true" if the default context is closed.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const defaultContext = browser.defaultContext;
			await browser.close();
			expect(defaultContext.closed).toBe(true);
		});
	});

	describe('close()', () => {
		it('Closes the context.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const context = browser.defaultContext;
			const page1 = context.newPage();
			const page2 = context.newPage();
			const originalClose1 = page1.close;
			const originalClose2 = page2.close;
			let pagesClosed = 0;

			vi.spyOn(page1, 'close').mockImplementation(() => {
				pagesClosed++;
				return originalClose1.call(page1);
			});

			vi.spyOn(page2, 'close').mockImplementation(() => {
				pagesClosed++;
				return originalClose2.call(page2);
			});

			page1.console.log('Incognito Page 1');
			page1.mainFrame.document.cookie = 'test=1';

			expect(context.cookieContainer.getCookies().length).toBe(1);

			expect(browser.contexts.length).toBe(1);
			expect(pagesClosed).toBe(0);

			let error: Error | null = null;
			try {
				await context.close();
			} catch (e) {
				error = <Error>e;
			}

			expect(browser.contexts.length).toBe(1);
			expect(pagesClosed).toBe(0);
			expect(error).toEqual(
				new Error(
					'Cannot close the default context. Use `browser.close()` to close the browser instead.'
				)
			);

			await browser.close();

			expect(browser.contexts.length).toBe(0);
			expect(pagesClosed).toBe(2);
			expect(context.cookieContainer.getCookies().length).toBe(0);
			expect(page1.virtualConsolePrinter.readAsString()).toBe('');
			expect(page1.virtualConsolePrinter.closed).toBe(true);
		});
	});

	describe('waitUntilComplete()', () => {
		it('Waits for all pages to complete.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page1 = browser.newPage();
			const page2 = browser.newPage();
			page1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			page2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			await browser.defaultContext.waitUntilComplete();
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
			browser.defaultContext.abort();
			await new Promise((resolve) => setTimeout(resolve, 50));
			expect(page1.mainFrame.window['test']).toBeUndefined();
			expect(page2.mainFrame.window['test']).toBeUndefined();
		});
	});

	describe('newPage()', () => {
		it('Creates a new page.', () => {
			const window = new Window();
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = window;
			const page = browser.defaultContext.newPage();
			expect(page instanceof DetachedBrowserPage).toBe(true);
			expect(browser.defaultContext.pages.length).toBe(2);
			expect(browser.defaultContext.pages[0].mainFrame.window).toBe(window);
			expect(browser.defaultContext.pages[1]).toBe(page);
		});
	});
});
