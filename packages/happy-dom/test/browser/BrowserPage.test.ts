import Browser from '../../src/browser/Browser';
import BrowserFrame from '../../src/browser/BrowserFrame';
import BrowserWindow from '../../src/window/BrowserWindow';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter';
import VirtualConsole from '../../src/console/VirtualConsole';
import Response from '../../src/fetch/Response';
import { describe, it, expect, afterEach, vi } from 'vitest';
import IGoToOptions from '../../src/browser/types/IGoToOptions';
import BrowserFrameFactory from '../../src/browser/utilities/BrowserFrameFactory';
import Event from '../../src/event/Event';
import DefaultBrowserPageViewport from '../../src/browser/DefaultBrowserPageViewport';
import * as PropertySymbol from '../../src/PropertySymbol';

describe('BrowserPage', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get virtualConsolePrinter()', () => {
		it('Returns the virtual console printer.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.virtualConsolePrinter).toBeInstanceOf(VirtualConsolePrinter);
		});
	});

	describe('get mainFrame()', () => {
		it('Returns the mainFrame.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame).toBeInstanceOf(BrowserFrame);
			expect(page.mainFrame.window).toBeInstanceOf(BrowserWindow);
		});
	});

	describe('get context()', () => {
		it('Returns the context.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.context).toBe(browser.defaultContext);
		});
	});

	describe('get console()', () => {
		it('Returns a virtual console by default.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.console).toBeInstanceOf(VirtualConsole);
			page.console.log('test');
			expect(page.virtualConsolePrinter.readAsString()).toBe('test\n');
		});

		it('Returns the browser console if set.', () => {
			const browser = new Browser({ console });
			const page = browser.defaultContext.newPage();
			expect(page.console).toBe(console);
		});
	});

	describe('get viewport()', () => {
		it('Returns a default viewport.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.viewport).toEqual(DefaultBrowserPageViewport);
		});

		it('Returns defined viewport.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.setViewport({ width: 100, height: 100, devicePixelRatio: 2 });
			expect(page.viewport).toEqual({ width: 100, height: 100, devicePixelRatio: 2 });
		});
	});

	describe('get frames()', () => {
		it('Returns the frames.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			expect(page.frames).toEqual([page.mainFrame, frame1, frame2]);
		});
	});

	describe('get content()', () => {
		it('Returns the document HTML content.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.window.document.write('<div>test</div>');
			expect(page.content).toBe('<html><head></head><body><div>test</div></body></html>');
		});
	});

	describe('set content()', () => {
		it('Sets the document HTML content.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.content = '<div>test</div>';
			expect(page.mainFrame.window.document.documentElement.outerHTML).toBe(
				'<html><head></head><body><div>test</div></body></html>'
			);
		});
	});

	describe('get url()', () => {
		it('Returns the document URL.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = 'http://localhost:3000';
			expect(page.url).toBe('http://localhost:3000/');
		});
	});

	describe('set url()', () => {
		it('Sets the document URL.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.url = 'http://localhost:3000';
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
		});
	});

	describe('close()', () => {
		it('Closes the page.', async () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			const mainFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);

			// Should work even if the body is removed.
			frame2.document.body.remove();

			await page.close();

			expect(browser.defaultContext.pages.length).toBe(0);

			expect(page.virtualConsolePrinter).toBe(null);
			expect(page.context).toBe(null);
			expect(page.mainFrame).toBe(null);
			expect(mainFrame.window).toBe(null);
			expect(frame1.window).toBe(null);
			expect(frame2.window).toBe(null);
		});

		it('Clears modules when closing.', async () => {
			const browser = new Browser({
				settings: {
					fetch: {
						virtualServers: [
							{
								url: 'https://localhost:8080/base/js/',
								directory: './test/nodes/html-script-element/modules/'
							}
						]
					}
				},
				console
			});
			const page = browser.defaultContext.newPage();
			const mainFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);

			mainFrame.url = 'https://localhost:8080/';

			const mainFrameWindow = mainFrame.window;
			const script = mainFrame.document.createElement('script');

			script.src = 'https://localhost:8080/base/js/TestModuleElement.js';
			script.type = 'module';
			script.onload = () => {
				mainFrame.document.body.appendChild(mainFrame.document.createElement('test-module'));
			};

			mainFrame.document.body.appendChild(script);

			await page.waitUntilComplete();

			expect(mainFrameWindow[PropertySymbol.modules].esm.size).toBe(5);
			expect(mainFrameWindow[PropertySymbol.modules].css.size).toBe(1);
			expect(mainFrameWindow[PropertySymbol.modules].json.size).toBe(1);

			await page.close();

			expect(browser.defaultContext.pages.length).toBe(0);

			expect(page.virtualConsolePrinter).toBe(null);
			expect(page.context).toBe(null);
			expect(page.mainFrame).toBe(null);
			expect(mainFrame.window).toBe(null);
			expect(frame1.window).toBe(null);
			expect(frame2.window).toBe(null);

			expect(mainFrameWindow.closed).toBe(true);
			expect(mainFrameWindow[PropertySymbol.modules].esm.size).toBe(0);
			expect(mainFrameWindow[PropertySymbol.modules].css.size).toBe(0);
			expect(mainFrameWindow[PropertySymbol.modules].json.size).toBe(0);
		});
	});

	describe('waitUntilComplete()', () => {
		it('Waits for all pages to complete.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			frame1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			await page.waitUntilComplete();
			expect(frame1.window['test']).toBe(1);
			expect(frame2.window['test']).toBe(2);
		});
	});

	describe('waitForNavigation()', () => {
		it('Waits page to have been navigated.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let isCalled = false;

			vi.spyOn(page.mainFrame, 'waitForNavigation').mockImplementation((): Promise<void> => {
				isCalled = true;
				return Promise.resolve();
			});

			await page.waitForNavigation();

			expect(isCalled).toBe(true);
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
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
			const browser = new Browser();
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
			const browser = new Browser();
			const page = browser.newPage();
			let event: Event | null = null;
			page.mainFrame.window.addEventListener('resize', (e) => (event = e));
			page.setViewport({ width: 100 });
			expect(page.viewport.width).toBe(100);
			expect(page.mainFrame.window.innerWidth).toBe(100);
			expect(page.mainFrame.window.outerWidth).toBe(100);
			expect(event).toBeInstanceOf(Event);
		});

		it('Sets the viewport height.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			let event: Event | null = null;
			page.mainFrame.window.addEventListener('resize', (e) => (event = e));
			page.setViewport({ height: 100 });
			expect(page.viewport.height).toBe(100);
			expect(page.mainFrame.window.innerHeight).toBe(100);
			expect(page.mainFrame.window.outerHeight).toBe(100);
			expect(event).toBeInstanceOf(Event);
		});

		it('Sets the viewport width and height.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			let event: Event | null = null;
			page.mainFrame.window.addEventListener('resize', (e) => (event = e));
			page.setViewport({ width: 100, height: 100 });
			expect(page.viewport.width).toBe(100);
			expect(page.viewport.height).toBe(100);
			expect(page.mainFrame.window.innerWidth).toBe(100);
			expect(page.mainFrame.window.outerWidth).toBe(100);
			expect(page.mainFrame.window.innerHeight).toBe(100);
			expect(page.mainFrame.window.outerHeight).toBe(100);
			expect(event).toBeInstanceOf(Event);
		});

		it('Sets the viewport device scale factor.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			let event: Event | null = null;
			page.mainFrame.window.addEventListener('resize', (e) => (event = e));
			page.setViewport({ devicePixelRatio: 2 });
			expect(page.viewport.devicePixelRatio).toBe(2);
			expect(page.mainFrame.window.devicePixelRatio).toBe(2);
			expect(event).toBeInstanceOf(Event);
		});
	});

	describe('goto()', () => {
		it('Goes to a page.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let usedURL: string | null = null;
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'goto').mockImplementation((url, options) => {
				usedURL = url;
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<Response>{ url });
			});

			const response = await page.goto('http://localhost:3000', { timeout: 10000 });
			expect((<Response>response).url).toBe('http://localhost:3000');
			expect(usedURL).toBe('http://localhost:3000');
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});

	describe('goBack()', () => {
		it('Navigates back in history.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'goBack').mockImplementation((options) => {
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<Response>{ status: 201 });
			});

			const response = await page.goBack({ timeout: 10000 });
			expect((<Response>response).status).toBe(201);
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});

	describe('goForward()', () => {
		it('Navigates forward in history.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'goForward').mockImplementation((options) => {
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<Response>{ status: 201 });
			});

			const response = await page.goForward({ timeout: 10000 });
			expect((<Response>response).status).toBe(201);
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});

	describe('goSteps()', () => {
		it('Navigates a delta in history.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let usedSteps: number | null = null;
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'goSteps').mockImplementation((steps, options) => {
				usedSteps = <number>steps;
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<Response>{ status: 201 });
			});

			const response = await page.goSteps(-2, { timeout: 10000 });
			expect((<Response>response).status).toBe(201);
			expect(usedSteps).toBe(-2);
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});

	describe('reload()', () => {
		it('Reloads the frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			let usedOptions: IGoToOptions | null = null;

			vi.spyOn(page.mainFrame, 'reload').mockImplementation((options) => {
				usedOptions = <IGoToOptions>options;
				return Promise.resolve(<Response>{ status: 201 });
			});

			const response = await page.reload({ timeout: 10000 });
			expect((<Response>response).status).toBe(201);
			expect(usedOptions).toEqual({ timeout: 10000 });
		});
	});
});
