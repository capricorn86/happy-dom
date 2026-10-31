import { Script } from 'vm';
import Browser from '../../src/browser/Browser';
import Event from '../../src/event/Event';
import BrowserWindow from '../../src/window/BrowserWindow';
import type Request from '../../src/fetch/Request';
import type Response from '../../src/fetch/Response';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Fetch from '../../src/fetch/Fetch';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import DOMException from '../../src/exception/DOMException';
import BrowserNavigationCrossOriginPolicyEnum from '../../src/browser/enums/BrowserNavigationCrossOriginPolicyEnum';
import BrowserFrameFactory from '../../src/browser/utilities/BrowserFrameFactory';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum';
import Headers from '../../src/fetch/Headers';
import * as PropertySymbol from '../../src/PropertySymbol';
import type HashChangeEvent from '../../src/event/events/HashChangeEvent';
import CrossOriginBrowserWindow from '../../src/window/CrossOriginBrowserWindow';
import type BrowserPage from '../../src/browser/BrowserPage';
import type IBrowserFrame from '../../src/browser/types/IBrowserFrame';

const STACK_TRACE_REGEXP = />.+$\s*/gm;

describe('BrowserFrame', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get childFrames()', () => {
		it('Returns child frames.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.childFrames).toEqual([]);
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			expect(page.mainFrame.childFrames).toEqual([frame1, frame2]);
		});
	});

	describe('get parentFrame()', () => {
		it('Returns the parent frame.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.parentFrame).toBe(null);
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(frame1);
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
			expect(page.mainFrame.window).toBeInstanceOf(BrowserWindow);
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

	describe('get closed()', () => {
		it('Returns "false" if the frame is not closed.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			expect(page.mainFrame.closed).toBe(false);
		});

		it('Returns "true" if the frame is closed.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.close();
			expect(page.mainFrame.closed).toBe(true);
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
			const browser = new Browser({
				settings: { errorCapture: BrowserErrorCaptureEnum.disabled }
			});
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
			page.mainFrame.url = 'http://localhost:3000';
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
		});

		it(`Supports URL as an object.`, async () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = <string>(<unknown>{ toString: () => 'http://localhost:3000' });
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
		});

		it('Restricts the access between a child frame and its ancestors when the origin changes.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = 'https://top.example/';
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame.window.parent === page.mainFrame.window).toBe(true);
			expect(childFrame[PropertySymbol.contentWindow] === childFrame.window).toBe(true);

			childFrame.url = 'https://other.example/';

			expect(childFrame.window.parent instanceof CrossOriginBrowserWindow).toBe(true);
			expect(childFrame.window.top instanceof CrossOriginBrowserWindow).toBe(true);
			expect(childFrame[PropertySymbol.contentWindow] instanceof CrossOriginBrowserWindow).toBe(
				true
			);
		});
	});

	describe('waitUntilComplete()', () => {
		it('Waits for all pages to complete.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 3; }, 10);');
			await page.waitUntilComplete();
			expect((<any>page.mainFrame.window)['test']).toBe(1);
			expect((<any>frame1.window)['test']).toBe(2);
			expect((<any>frame2.window)['test']).toBe(3);
		});

		it('Traces never ending timeout when calling waitUntilComplete() with the setting "debug.traceWaitUntilComplete" set to a time in ms.', async () => {
			const browser = new Browser({
				settings: {
					debug: {
						traceWaitUntilComplete: 100
					}
				}
			});
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			frame2.evaluate(
				'function neverEndingTimeout() { setTimeout(neverEndingTimeout, 10); } neverEndingTimeout();'
			);
			let error: Error | null = null;
			try {
				await page.waitUntilComplete();
			} catch (e) {
				error = <Error>e;
			}
			expect(error?.toString().replace(STACK_TRACE_REGEXP, '') + '> testFunction (test.js:1:1)\n')
				.toBe(`Error: The maximum time was reached for "waitUntilComplete()".

1 task did not end in time.

The following traces were recorded:

Timer #1
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
> testFunction (test.js:1:1)
`);
		});

		it('Traces never ending task when calling waitUntilComplete() with the setting "debug.traceWaitUntilComplete" set to a time in ms.', async () => {
			const browser = new Browser({
				settings: {
					debug: {
						traceWaitUntilComplete: 100
					}
				}
			});
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			frame2[PropertySymbol.asyncTaskManager].startTask();
			let error: Error | null = null;
			try {
				await page.waitUntilComplete();
			} catch (e) {
				error = <Error>e;
			}
			expect(error?.toString().replace(STACK_TRACE_REGEXP, '') + '> testFunction (test.js:1:1)\n')
				.toBe(`Error: The maximum time was reached for "waitUntilComplete()".

1 task did not end in time.

The following traces were recorded:

Task #1
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
> testFunction (test.js:1:1)
`);
		});
	});

	describe('waitForNavigation()', () => {
		it('Waits page to have been navigated.', async () => {
			let count = 0;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				count++;
				return Promise.resolve(<Response>{
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										count === 1 ? '<a href="http://localhost:3000/navigated/">' : '<b>Navigated</b>'
									),
								1
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000', {
				referrer: 'http://localhost:3000/referrer',
				referrerPolicy: 'no-referrer-when-downgrade'
			});

			page.mainFrame.document.querySelector('a')?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.document.querySelector('b')?.textContent).toBe('Navigated');
		});
	});

	describe('abort()', () => {
		it('Aborts all ongoing operations.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			page.mainFrame.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame1.evaluate('setTimeout(() => { globalThis.test = 1; }, 10);');
			frame2.evaluate('setTimeout(() => { globalThis.test = 2; }, 10);');
			page.abort();
			await new Promise((resolve) => setTimeout(resolve, 50));
			expect((<any>page.mainFrame.window)['test']).toBeUndefined();
			expect((<any>frame1.window)['test']).toBeUndefined();
			expect((<any>frame2.window)['test']).toBeUndefined();
		});
	});

	describe('evaluate()', () => {
		it("Evaluates a code string in the frame's context.", () => {
			const browser = new Browser();
			const page = browser.newPage();
			expect(page.mainFrame.evaluate('globalThis.test = 1')).toBe(1);
			expect((<any>page.mainFrame.window)['test']).toBe(1);
		});

		it("Evaluates a VM script in the frame's context.", () => {
			const browser = new Browser();
			const page = browser.newPage();
			expect(page.mainFrame.evaluate(new Script('globalThis.test = 1'))).toBe(1);
			expect((<any>page.mainFrame.window)['test']).toBe(1);
		});
	});

	describe('goto()', () => {
		describe('Ancestor windows', () => {
			const mockFetch = (window: BrowserWindow, finalURL?: string): void => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(() => {
					const response = new window.Response('<body>Child</body>');
					if (finalURL) {
						Object.defineProperty(response, 'url', { value: finalURL });
					}
					return Promise.resolve(response);
				});
			};

			const navigateChildFrame = async (
				parentURL: string,
				childURL: string
			): Promise<{
				browser: Browser;
				page: BrowserPage;
				parentFrame: IBrowserFrame;
				frame: IBrowserFrame;
			}> => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://top.example/';
				const parentFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				parentFrame.url = parentURL;
				const frame = BrowserFrameFactory.createChildFrame(parentFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto(childURL);

				return { browser, page, parentFrame, frame };
			};

			it('Restricts the top window but not the parent window when the child has the same origin as the parent.', async () => {
				const { browser, page, parentFrame, frame } = await navigateChildFrame(
					'https://parent.example/',
					'https://parent.example/child'
				);

				expect(frame.window.parent).toBe(parentFrame.window);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top.document).toBeUndefined();
				expect(frame.window.top).not.toBe(page.mainFrame.window);

				await browser.close();
			});

			it('Restricts the parent window but not the top window when the child has the same origin as the top.', async () => {
				const { browser, page, frame } = await navigateChildFrame(
					'https://parent.example/',
					'https://top.example/child'
				);

				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.parent.document).toBeUndefined();
				expect(frame.window.top).toBe(page.mainFrame.window);

				await browser.close();
			});

			it('Restricts both the parent and top window when the child has a different origin than both.', async () => {
				const { browser, frame } = await navigateChildFrame(
					'https://parent.example/',
					'https://other.example/'
				);

				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.parent.document).toBeUndefined();
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top.document).toBeUndefined();

				await browser.close();
			});

			it('Restricts the top window but not the parent window when the child navigates to "about:blank" and the parent has another origin than the top.', async () => {
				const { browser, parentFrame, frame } = await navigateChildFrame(
					'https://parent.example/',
					'about:blank'
				);

				expect(frame.window.parent).toBe(parentFrame.window);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top.document).toBeUndefined();

				await browser.close();
			});

			it('Does not restrict the parent and top window when the parent is "about:blank" and the child has the same origin as the top.', async () => {
				const { browser, page, parentFrame, frame } = await navigateChildFrame(
					'about:blank',
					'https://top.example/child'
				);

				expect(frame.window.parent).toBe(parentFrame.window);
				expect(frame.window.top).toBe(page.mainFrame.window);

				await browser.close();
			});

			it('Restricts both the parent and top window when the parent is "about:blank" and the child has a different origin.', async () => {
				const { browser, frame } = await navigateChildFrame(
					'about:blank',
					'https://other.example/'
				);

				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.parent.document).toBeUndefined();
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top.document).toBeUndefined();

				await browser.close();
			});

			it('Restricts the ancestors when navigating a cross-origin frame to another origin and back.', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');
				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await frame.goto('https://another.example/');
				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await frame.goto('https://parent.example/other');
				expect(frame.window.parent).toBe(page.mainFrame.window);
				expect(frame.window.top).toBe(page.mainFrame.window);

				await browser.close();
			});

			it('Restricts the ancestors before the content is written when a redirect changes the origin.', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				let parentInBeforeContentCallback: unknown = null;
				mockFetch(page.mainFrame.window, 'https://other.example/');

				await frame.goto('https://parent.example/redirect', {
					beforeContentCallback: (window) => {
						parentInBeforeContentCallback = window.parent;
					}
				});

				expect(parentInBeforeContentCallback).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await browser.close();
			});

			it('Allows the ancestors when a redirect changes the origin to the origin of the ancestors.', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window, 'https://parent.example/final');

				await frame.goto('https://other.example/redirect');

				expect(frame.window.parent).toBe(page.mainFrame.window);
				expect(frame.window.top).toBe(page.mainFrame.window);

				await browser.close();
			});

			it('Throws a security error when a cross-origin frame accesses the location of its ancestors.', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');

				for (const ancestor of [frame.window.parent, frame.window.top]) {
					expect(() => ancestor.location.href).toThrow(
						new DOMException(
							'Blocked a frame from accessing a cross-origin frame.',
							DOMExceptionNameEnum.securityError
						)
					);
				}

				await browser.close();
			});

			it('Does not give a cross-origin frame the origin of its parent when it navigates itself to "about:blank" and then to a "javascript:" URL.', async () => {
				const browser = new Browser({ settings: { enableJavaScriptEvaluation: true } });
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');
				await frame.goto('about:blank');
				await frame.goto(
					'javascript:document.body.textContent = String([parent.document, top.document].join())'
				);

				expect(frame.window.document.body.textContent).toBe(',');

				await browser.close();
			});

			it('Gives an "about:blank" document the origin of the frame that initiated the navigation.', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');

				await frame.goto('about:blank', { initiatorFrame: page.mainFrame });
				expect(frame.window.parent).toBe(page.mainFrame.window);
				expect(frame.window.top).toBe(page.mainFrame.window);

				await frame.goto('https://child.example/');
				await frame.goto('about:blank');
				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);

				await browser.close();
			});

			it('Keeps the origin of the document when a frame navigates to "about:blank".', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');
				await frame.goto('about:blank');

				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await browser.close();
			});

			it('Keeps the opaque origin of a "data:" document when a frame navigates to "about:blank".', async () => {
				const browser = new Browser();
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('data:text/html,<body>Child</body>', {
					referrer: 'https://parent.example'
				});
				await frame.goto('about:blank');

				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await browser.close();
			});

			it('Does not give a cross-origin frame access to its ancestors when navigating to a "javascript:" URL.', async () => {
				const browser = new Browser({ settings: { enableJavaScriptEvaluation: true } });
				const page = browser.newPage();
				page.mainFrame.url = 'https://parent.example/';
				const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
				mockFetch(page.mainFrame.window);

				await frame.goto('https://child.example/');
				const window = frame.window;

				await frame.goto(
					'javascript:document.body.textContent = String([parent.document, top.document].join())'
				);

				expect(frame.window).toBe(window);
				expect(frame.window.document.body.textContent).toBe(',');
				expect(frame.window.parent).toBeInstanceOf(CrossOriginBrowserWindow);
				expect(frame.window.top).toBeInstanceOf(CrossOriginBrowserWindow);

				await browser.close();
			});
		});

		it('Navigates to a URL.', async () => {
			let request: Request | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				request = (<any>this).request;
				return Promise.resolve(<Response>{
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

			expect((<Response>response).url).toBe('http://localhost:3000/');
			expect((<Request>(<unknown>request)).referrer).toBe('http://localhost:3000/referrer');
			expect((<Request>(<unknown>request)).referrerPolicy).toBe('no-referrer-when-downgrade');
			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(oldWindow.location.href).toBe('about:blank');
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
		});

		it('Triggers "beforeContentCallback" before content is loaded into the document', async () => {
			let request: Request | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				request = (<any>this).request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			let loadedWindow: BrowserWindow | null = null;
			await page.mainFrame.goto('http://localhost:3000', {
				beforeContentCallback: (window: BrowserWindow) => {
					expect(window.document.body.children.length).toBe(0);
					loadedWindow = window;
				}
			});

			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
			expect(loadedWindow).toBe(page.mainFrame.window);
		});

		it('Triggers "browser.settings.navigation.beforeContentCallback" before content is loaded into the document', async () => {
			let request: Request | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				request = (<any>this).request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			let loadedWindow: BrowserWindow | null = null;
			const browser = new Browser({
				settings: {
					navigation: {
						beforeContentCallback: (window: BrowserWindow) => {
							expect(window.document.body.children.length).toBe(0);
							loadedWindow = window;
						}
					}
				}
			});
			const page = browser.newPage();
			await page.mainFrame.goto('http://localhost:3000');

			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.location.href).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
			expect(loadedWindow).toBe(page.mainFrame.window);
		});

		it('Navigates to a URL with "javascript:" as protocol.', async () => {
			const browser = new Browser({
				settings: {
					enableJavaScriptEvaluation: true,
					suppressCodeGenerationFromStringsWarning: true
				}
			});
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
				error = <Error>e;
			}

			expect(error).toEqual(
				new page.mainFrame.window.DOMException(
					'The operation was aborted. Request timed out.',
					DOMExceptionNameEnum.timeoutError
				)
			);

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');
		});

		it('Handles error status code in response.', async () => {
			let request: Request | null = null;
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				request = (<any>this).request;
				return Promise.resolve(<Response>{
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

			expect((<Response>(<unknown>response)).status).toBe(404);
			expect(page.virtualConsolePrinter.readAsString()).toBe(
				'GET http://localhost:3000/ 404 (Not Found)\n'
			);
		});

		it('Handles reject when performing fetch.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Error'));
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;
			let error: Error | null = null;
			try {
				await page.mainFrame.goto('http://localhost:9999');
			} catch (e) {
				error = <Error>e;
			}

			expect(error).toEqual(new Error('Error'));

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');
		});

		it(`Doesn't navigate a child frame with a different origin from its parent if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.sameOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin
					}
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await childFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childFrame.url).toBe('about:blank');
			expect(childFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates a child frame with the same origin as its parent if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.sameOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin
					}
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate a popup with a different origin from its parent if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.sameOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await childPage.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childPage.mainFrame.url).toBe('about:blank');
			expect(childPage.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates a popup with the same origin as its parent if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.sameOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childPage.mainFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childPage.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate from one origin to another if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.sameOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.sameOrigin
					}
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

		it(`Navigates from "http" to "https" if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.strictOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.strictOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'http://github.com';

			await childPage.mainFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childPage.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Navigates from "https" to "https" if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.strictOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.strictOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childPage.mainFrame.goto('https://github.com/capricorn86/happy-dom');

			expect(childPage.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Navigates from "about" to "http" if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.strictOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.strictOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			await childPage.mainFrame.goto('http://github.com/capricorn86/happy-dom');

			expect(childPage.mainFrame.url).toBe('http://github.com/capricorn86/happy-dom');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Navigates from "https" to "about" if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.strictOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.strictOrigin
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			await childPage.mainFrame.goto('about:blank');

			expect(childPage.mainFrame.url).toBe('about:blank');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate from "https" to "http" if the setting "navigation.crossOriginPolicy" is set to "${BrowserNavigationCrossOriginPolicyEnum.strictOrigin}".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.strictOrigin
					}
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'https://github.com';

			const response = await page.mainFrame.goto('http://github.com/capricorn86/happy-dom');

			expect(response).toBeNull();
			expect(page.mainFrame.url).toBe('https://github.com/');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates child frames if the setting "navigation.disableChildFrameNavigation" is set to "false".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableChildFrameNavigation: false,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			await childFrame.goto('http://localhost:9999');

			expect(childFrame.url).toBe('http://localhost:9999/');
			expect(childFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate child frames if the setting "navigation.disableChildFrameNavigation" is set to "true".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableChildFrameNavigation: true,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const oldWindow = childFrame.window;

			const response = await childFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childFrame.url).toBe('about:blank');
			expect(childFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates child pages if the setting "navigation.disableChildPageNavigation" is set to "false".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('Test'),
					headers: new Headers()
				}));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableChildPageNavigation: false,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			await childPage.mainFrame.goto('http://localhost:9999');

			expect(childPage.mainFrame.url).toBe('http://localhost:9999/');
			expect(childPage.mainFrame.window === oldWindow).toBe(false);
		});

		it(`Doesn't navigate child pages if the setting "navigation.disableChildPageNavigation" is set to "true".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableChildPageNavigation: true,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const childPage = browser.newPage();
			childPage.mainFrame[PropertySymbol.openerFrame] = page.mainFrame;
			const oldWindow = childPage.mainFrame.window;

			const response = await childPage.mainFrame.goto('http://localhost:9999');

			expect(response).toBeNull();
			expect(childPage.mainFrame.url).toBe('about:blank');
			expect(childPage.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Doesn't navigate the main frame if the setting "navigation.disableMainFrameNavigation" is set to "true".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Should not be called.'));
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableMainFrameNavigation: true,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			await page.mainFrame.goto('http://localhost:9999');

			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window === oldWindow).toBe(true);
		});

		it(`Navigates the main frame if the setting "navigation.disableMainFrameNavigation" is set to "false".`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const browser = new Browser({
				settings: {
					navigation: {
						disableMainFrameNavigation: false,
						disableFallbackToSetURL: true
					}
				}
			});
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			await page.mainFrame.goto('http://localhost:9999');

			expect(page.mainFrame.url).toBe('http://localhost:9999/');
			expect(page.mainFrame.window === oldWindow).toBe(false);
		});

		it('Sets the correct location after being redirected.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					status: 200,
					url: 'http://localhost:3000/redirected/',
					text: () => Promise.resolve('<b>Redirected</b>')
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000');

			expect(page.mainFrame.content).toBe(
				'<html><head></head><body><b>Redirected</b></body></html>'
			);
			expect(page.mainFrame.url).toBe('http://localhost:3000/redirected/');
		});

		it('Navigates to a virtual server page.', async () => {
			const browser = new Browser({
				settings: {
					enableJavaScriptEvaluation: true,
					enableCSSFileLoading: true,
					suppressCodeGenerationFromStringsWarning: true,
					fetch: {
						virtualServers: [
							{
								url: /https:\/\/example\.com\/[a-z]{2}\/[a-z]{2}\//,
								directory: './test/fetch/virtual-server'
							}
						]
					}
				}
			});
			const page = browser.newPage();

			await page.mainFrame.goto('https://example.com/sv/se/');

			await page.mainFrame.waitUntilComplete();

			expect(page.mainFrame.url).toBe('https://example.com/sv/se/');
			expect(page.mainFrame.content).toBe(`<html><head>
    <title>Virtual Server</title>
    <script src="js/async.js" async=""></script>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div id="async-1">true</div>
    <div id="async-2">true</div>
    <div id="sync">true</div>
    <script src="js/sync.js"></script>


</body></html>`);
			expect(
				page.mainFrame.window.getComputedStyle(page.mainFrame.document.body).backgroundColor
			).toBe('red');
		});

		it('Navigates using hash.', async () => {
			const browser = new Browser();
			const page = browser.newPage();

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 1))
				});
			});

			await page.mainFrame.goto('http://localhost:3000');

			expect(page.mainFrame.url).toBe('http://localhost:3000/');

			const window = page.mainFrame.window;
			let hashChangeEvent: HashChangeEvent | null = null;

			window.addEventListener('hashchange', (event) => {
				hashChangeEvent = <HashChangeEvent>event;
			});

			await page.mainFrame.goto('http://localhost:3000/#test');
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(hashChangeEvent!.oldURL).toBe('http://localhost:3000/');
			expect(hashChangeEvent!.newURL).toBe('http://localhost:3000/#test');
			expect(page.mainFrame.url).toBe('http://localhost:3000/#test');
			expect(window).toBe(page.mainFrame.window);
		});
	});

	describe('goBack()', () => {
		it('Navigates back in history.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				return Promise.resolve(<Response>{
					status: 200,
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										(<any>this).request.url === 'http://localhost:3000/'
											? '<a href="http://localhost:3000/navigated/">'
											: '<b>Navigated</b>'
									),
								10
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000', {
				referrer: 'http://localhost:3000/referrer',
				referrerPolicy: 'no-referrer-when-downgrade'
			});

			page.mainFrame.document.querySelector('a')?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.document.querySelector('b')?.textContent).toBe('Navigated');

			const result1 = await page.mainFrame.goBack();

			expect(result1?.status).toBe(200);
			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe(
				'<a href="http://localhost:3000/navigated/"></a>'
			);

			await page.mainFrame.goBack();

			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');

			const result2 = await page.mainFrame.goBack();

			expect(result2).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
		});
	});

	describe('goForward()', () => {
		it('Navigates forward in history.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				return Promise.resolve(<Response>{
					status: 200,
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										(<any>this).request.url === 'http://localhost:3000/'
											? '<a href="http://localhost:3000/navigated/">'
											: '<b>Navigated</b>'
									),
								10
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000', {
				referrer: 'http://localhost:3000/referrer',
				referrerPolicy: 'no-referrer-when-downgrade'
			});

			page.mainFrame.document.querySelector('a')?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.document.querySelector('b')?.textContent).toBe('Navigated');

			const result1 = await page.mainFrame.goBack();

			expect(result1?.status).toBe(200);

			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe(
				'<a href="http://localhost:3000/navigated/"></a>'
			);

			await page.mainFrame.goForward();

			expect(page.mainFrame.url).toBe('http://localhost:3000/navigated/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('<b>Navigated</b>');

			const result2 = await page.mainFrame.goForward();

			expect(result2).toBeNull();
			expect(page.mainFrame.url).toBe('http://localhost:3000/navigated/');
		});
	});

	describe('goSteps()', () => {
		it('Navigates a delta in history.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (
				this: Fetch
			): Promise<Response> {
				return Promise.resolve(<Response>{
					status: 200,
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										(<any>this).request.url === 'http://localhost:3000/'
											? '<a href="http://localhost:3000/navigated/">'
											: '<b>Navigated</b>'
									),
								10
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000', {
				referrer: 'http://localhost:3000/referrer',
				referrerPolicy: 'no-referrer-when-downgrade'
			});

			page.mainFrame.document.querySelector('a')?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.document.querySelector('b')?.textContent).toBe('Navigated');

			const result1 = await page.mainFrame.goSteps(-2);

			expect(result1).toBeNull();
			expect(page.mainFrame.url).toBe('about:blank');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('');

			const result2 = await page.mainFrame.goSteps(1);

			expect(result2?.status).toBe(200);
			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe(
				'<a href="http://localhost:3000/navigated/"></a>'
			);

			await page.mainFrame.goSteps(-1);
			await page.mainFrame.goSteps(2);

			expect(page.mainFrame.url).toBe('http://localhost:3000/navigated/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('<b>Navigated</b>');

			const result3 = await page.mainFrame.goSteps(1);

			expect(result3).toBeNull();
			expect(page.mainFrame.url).toBe('http://localhost:3000/navigated/');
		});
	});

	describe('reload()', () => {
		it('Reloads the frame.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					status: 200,
					text: () => new Promise((resolve) => setTimeout(() => resolve('Test'), 1))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();

			await page.mainFrame.goto('http://localhost:3000');

			expect(page.mainFrame.document.body.innerHTML).toBe('Test');

			const result1 = await page.mainFrame.reload();

			expect(result1?.status).toBe(200);

			expect(page.mainFrame.url).toBe('http://localhost:3000/');
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
		});
	});
});
