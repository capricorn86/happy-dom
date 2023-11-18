import { Script } from 'vm';
import Browser from '../../src/browser/Browser';
import BrowserFrameUtility from '../../src/browser/BrowserFrameUtility';
import Event from '../../src/event/Event';
import Window from '../../src/window/Window';
import IRequest from '../../src/fetch/types/IRequest';
import IResponse from '../../src/fetch/types/IResponse';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Fetch from '../../src/fetch/Fetch';
import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import BrowserNavigationEnum from '../../src/browser/types/BrowserNavigationEnum';

describe('BrowserFrame', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get childFrames()', () => {
		it('Returns child frames.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.childFrames).toEqual([]);
			const frame1 = BrowserFrameUtility.newFrame(page.mainFrame);
			const frame2 = BrowserFrameUtility.newFrame(page.mainFrame);
			expect(page.mainFrame.childFrames).toEqual([frame1, frame2]);
		});
	});

	describe('get parentFrame()', () => {
		it('Returns the parent frame.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.parentFrame).toBe(null);
			const frame1 = BrowserFrameUtility.newFrame(page.mainFrame);
			const frame2 = BrowserFrameUtility.newFrame(frame1);
			expect(frame2.parentFrame).toBe(frame1);
			expect(frame1.parentFrame).toBe(page.mainFrame);
			expect(page.mainFrame.parentFrame).toBe(null);
		});
	});

	describe('get page()', () => {
		it('Returns the page.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.page).toBe(page);
		});
	});

	describe('get window()', () => {
		it('Returns the window.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.window).toBeInstanceOf(Window);
			expect(page.mainFrame.window.console).toBe(page.console);
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
			page.mainFrame.content = '<div>test</div>';
			expect(page.mainFrame.window.document.documentElement.outerHTML).toBe(
				'<html><head></head><body><div>test</div></body></html>'
			);
		});

		it('Removes listeners and child nodes before setting the document HTML content.', () => {
			const browser = new Browser({ settings: { disableErrorCapturing: true } });
			const page = browser.defaultContext.newPage();
			page.mainFrame.content = '<div>test</div>';
			page.mainFrame.window.document.addEventListener('load', () => {
				throw new Error('Should not be called');
			});
			page.mainFrame.window.document.addEventListener('error', () => {
				throw new Error('Should not be called');
			});
			page.mainFrame.content = '<div>test</div>';
			page.mainFrame.window.document.dispatchEvent(new Event('load'));
			page.mainFrame.window.document.dispatchEvent(new Event('error'));
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
			expect(page.mainFrame.url).toBe('http://localhost:3000/');
		});
	});

	describe('set url()', () => {
		it('Sets the document URL.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			const location = page.mainFrame.window.location;
			page.mainFrame.url = 'http://localhost:3000';
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.location).not.toBe(location);
		});
	});

	describe('whenComplete()', () => {
		it('Waits for all pages to complete.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameUtility.newFrame(page.mainFrame);
			const frame2 = BrowserFrameUtility.newFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 3; }, 10);');
			await page.whenComplete();
			expect(page.mainFrame.window['test']).toBe(1);
			expect(frame1.window['test']).toBe(2);
			expect(frame2.window['test']).toBe(3);
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameUtility.newFrame(page.mainFrame);
			const frame2 = BrowserFrameUtility.newFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			page.abort();
			await new Promise((resolve) => setTimeout(resolve, 50));
			expect(page.mainFrame.window['test']).toBeUndefined();
			expect(frame1.window['test']).toBeUndefined();
			expect(frame2.window['test']).toBeUndefined();
		});
	});

	describe('evaluate()', () => {
		it("Evaluates a code string in the frame's context.", () => {
			const browser = new Browser();
			const page = browser.newPage();
			expect(page.mainFrame.evaluate('globalThis.test = 1')).toBe(1);
			expect(page.mainFrame.window['test']).toBe(1);
		});

		it("Evaluates a VM script in the frame's context.", () => {
			const browser = new Browser();
			const page = browser.newPage();
			expect(page.mainFrame.evaluate(new Script('globalThis.test = 1'))).toBe(1);
			expect(page.mainFrame.window['test']).toBe(1);
		});
	});

	describe('goto()', () => {
		it('Navigates to a URL.', async () => {
			let request: IRequest | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				request = this.request;
				return Promise.resolve(<IResponse>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			const response = await page.mainFrame.goto('http://localhost:3000', {
				referrer: 'http://localhost:3000/referrer',
				referrerPolicy: 'no-referrer-when-downgrade'
			});

			expect((<IResponse>response).url).toBe('http://localhost:3000/');
			expect((<IRequest>(<unknown>request)).referrer).toBe('http://localhost:3000/referrer');
			expect((<IRequest>(<unknown>request)).referrerPolicy).toBe('no-referrer-when-downgrade');
			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(oldWindow.location.href).toBe('about:blank');
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
		});

		it('Navigates to a URL with "javascript:" as protocol.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			const response = await page.mainFrame.goto('javascript:document.write("test");');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window).toBe(oldWindow);

			expect(page.mainFrame.window.document.body.innerHTML).toBe('test');
		});

		it('Navigates to a URL with "about:" as protocol.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			const response = await page.mainFrame.goto('about:blank');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window).not.toBe(oldWindow);
		});

		it('Aborts request if it times out.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			let error: Error | null = null;
			try {
				await page.mainFrame.goto('http://localhost:9999', {
					timeout: 1
				});
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'The operation was aborted. Request timed out.',
					DOMExceptionNameEnum.abortError
				)
			);

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');
		});

		it('Handles error status code in response.', async () => {
			let request: IRequest | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				request = this.request;
				return Promise.resolve(<IResponse>{
					url: request?.url,
					status: 404,
					statusText: 'Not Found',
					text: () =>
						new Promise((resolve) =>
							setTimeout(() => resolve('<html><body>404 error</body></html>'), 1)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			const response = await page.mainFrame.goto('http://localhost:3000');

			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('404 error');

			expect((<IResponse>(<unknown>response)).status).toBe(404);
			expect(page.virtualConsolePrinter.readAsString()).toBe(
				'GET http://localhost:3000/ 404 (Not Found)\n'
			);
		});

		it('Handles reject when performing fetch.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Error'));
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			let error: Error | null = null;
			try {
				await page.mainFrame.goto('http://localhost:9999');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(new Error('Error'));

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['deny']"`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.deny]
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			await page.mainFrame.goto('http://localhost:9999');

			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates if the setting "browserNavigation" is set to "['allow']"`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('Test')
				});
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allow]
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			await page.mainFrame.goto('http://localhost:9999');

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['allow-same-origin']" and the parent is of a different origin.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowSameOrigin]
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameUtility.newFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await childFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childFrame.url).toBe('about:blank');
			expect(childFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates if the setting "browserNavigation" is set to "['allow-same-origin']" and the parent is the same origin.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowSameOrigin]
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameUtility.newFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['allow-same-origin']" and the opener is of a different origin.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowSameOrigin]
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage(page.mainFrame);
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await childPage.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childPage.mainFrame.url).toBe('about:blank');
			expect(childPage.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigate if the setting "browserNavigation" is set to "['allow-same-origin']" and the opener has the same origin.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowSameOrigin]
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage(page.mainFrame);
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childPage.mainFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childPage.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['allow-same-origin']" when navigating from one origin to another.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowSameOrigin]
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await page.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('https://github.com/');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates if the setting "browserNavigation" is set to "['allowChildFrames']" inside a child frame.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowChildFrames]
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameUtility.newFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			await childFrame.goto('http://localhost:9999');

			expect(childFrame.url).toBe('http://localhost:9999/');
			expect(childFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['allowChildFrames']" inside a main frame.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowChildFrames]
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			const response = await page.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates if the setting "browserNavigation" is set to "['allowChildPages']" inside a child page.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowChildPages]
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage(page.mainFrame);
			const oldWindow = childPage.mainFrame.window;

			await childPage.mainFrame.goto('http://localhost:9999');

			expect(childPage.mainFrame.url).toBe('http://localhost:9999/');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate if the setting "browserNavigation" is set to "['allowChildPages']" inside a main page.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					browserNavigation: [BrowserNavigationEnum.allowChildPages]
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			const response = await page.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});
	});
});
