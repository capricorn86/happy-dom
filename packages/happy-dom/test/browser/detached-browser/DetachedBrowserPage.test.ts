import DetachedBrowser from '../../../src/browser/detached-browser/DetachedBrowser';
import DetachedBrowserFrame from '../../../src/browser/detached-browser/DetachedBrowserFrame';
import Window from '../../../src/window/Window';
import BrowserWindow from '../../../src/window/BrowserWindow';
import VirtualConsolePrinter from '../../../src/console/VirtualConsolePrinter';
import VirtualConsole from '../../../src/console/VirtualConsole';
import IResponse from '../../../src/fetch/types/IResponse';
import { describe, it, expect, afterEach, vi } from 'vitest';
import IGoToOptions from '../../../src/browser/types/IGoToOptions';
import BrowserFrameFactory from '../../../src/browser/utilities/BrowserFrameFactory';

describe('DetachedBrowserPage', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get virtualConsolePrinter()', () => {
		it('Returns the virtual console printer.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page = browser.defaultContext.newPage();
			expect(page.virtualConsolePrinter).toBeInstanceOf(VirtualConsolePrinter);
		});
	});

	describe('get mainFrame()', () => {
		it('Returns the mainFrame.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame).toBeInstanceOf(DetachedBrowserFrame);
			expect(page.mainFrame.window).toBeInstanceOf(BrowserWindow);
		});
	});

	describe('get context()', () => {
		it('Returns the context.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page = browser.defaultContext.newPage();
			expect(page.context).toBe(browser.defaultContext);
		});
	});

	describe('get console()', () => {
		it('Returns a virtual console by default.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			const page = browser.defaultContext.newPage();
			expect(page.console).toBeInstanceOf(VirtualConsole);
			page.console.log('test');
			expect(page.virtualConsolePrinter.readAsString()).toBe('test\n');
		});

		it('Returns the browser console if set.', () => {
			const browser = new DetachedBrowser(BrowserWindow, { console });
			const page = browser.defaultContext.newPage();
			expect(page.console).toBe(console);
		});
	});

	describe('get frames()', () => {
		it('Returns the frames.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			const frame1 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			expect(page.frames).toEqual([page.mainFrame, frame1, frame2]);
		});
	});

	describe('get content()', () => {
		it('Returns the document HTML content.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			page.mainFrame.window.document.write('<div>test</div>');
			expect(page.content).toBe('<html><head></head><body><div>test</div></body></html>');
		});
	});

	describe('set content()', () => {
		it('Sets the document HTML content.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			page.content = '<div>test</div>';
			expect(page.mainFrame.window.document.documentElement.outerHTML).toBe(
				'<html><head></head><body><div>test</div></body></html>'
			);
		});
	});

	describe('get url()', () => {
		it('Returns the document URL.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = 'http://localhost:3000';
			expect(page.url).toBe('http://localhost:3000/');
		});
	});

	describe('set url()', () => {
		it('Sets the document URL.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			page.url = 'http://localhost:3000';
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
		});
	});

	describe('close()', () => {
		it('Closes the page.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.defaultContext.newPage();
			const mainFrame = BrowserFrameFactory.newChildFrame(page.mainFrame);
			const frame1 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.newChildFrame(page.mainFrame);

			await page.close();

			// There is always one page in a detached browser context.
			expect(browser.defaultContext.pages.length).toBe(1);

			expect(page.virtualConsolePrinter).toBe(null);
			expect(page.context).toBe(null);
			expect(page.mainFrame).toBe(null);
			expect(mainFrame.window).toBe(null);
			expect(frame1.window).toBe(null);
			expect(frame2.window).toBe(null);
		});
	});

	describe('whenComplete()', () => {
		it('Waits for all pages to complete.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			frame1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			await page.whenComplete();
			expect(frame1.window['test']).toBe(1);
			expect(frame2.window['test']).toBe(2);
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.newChildFrame(page.mainFrame);
			frame1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			page.abort();
			await new Promise((resolve) => setTimeout(resolve, 50));
			expect(frame1.window['test']).toBeUndefined();
			expect(frame2.window['test']).toBeUndefined();
		});
	});

	describe('evaluate()', () => {
		it("Evaluates code in the page's context.", () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			let evaluatedCode: string | null = null;
			vi.spyOn(page.mainFrame, 'evaluate').mockImplementation((code) => {
				evaluatedCode = <string>code;
				return 'returnValue';
			});
			expect(page.evaluate('test')).toBe('returnValue');
			expect(evaluatedCode).toBe('test');
		});
	});

	describe('setViewport()', () => {
		it('Sets the viewport width.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			page.setViewport({ width: 100 });
			expect(page.mainFrame.window.innerWidth).toBe(100);
			expect(page.mainFrame.window.outerWidth).toBe(100);
		});

		it('Sets the viewport height.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			page.setViewport({ height: 100 });
			expect(page.mainFrame.window.innerHeight).toBe(100);
			expect(page.mainFrame.window.outerHeight).toBe(100);
		});

		it('Sets the viewport width and height.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			page.setViewport({ width: 100, height: 100 });
			expect(page.mainFrame.window.innerWidth).toBe(100);
			expect(page.mainFrame.window.outerWidth).toBe(100);
			expect(page.mainFrame.window.innerHeight).toBe(100);
			expect(page.mainFrame.window.outerHeight).toBe(100);
		});

		it('Sets the viewport device scale factor.', () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			page.setViewport({ devicePixelRatio: 2 });
			expect(page.mainFrame.window.devicePixelRatio).toBe(2);
		});
	});

	describe('goto()', () => {
		it('Goes to a page.', async () => {
			const browser = new DetachedBrowser(BrowserWindow);
			browser.defaultContext.pages[0].mainFrame.window = new Window();
			const page = browser.newPage();
			let usedURL: string | null = null;
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'goto').mockImplementation((url, options) => {
				usedURL = url;
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<IResponse>{ url });
			});

			const response = await page.goto('http://localhost:3000', { timeout: 10000 });
			expect((<IResponse>response).url).toBe('http://localhost:3000');
			expect(usedURL).toBe('http://localhost:3000');
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});
});
