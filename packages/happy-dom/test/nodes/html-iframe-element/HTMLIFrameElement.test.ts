import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IHTMLIFrameElement from '../../../src/nodes/html-iframe-element/IHTMLIFrameElement.js';
import IResponse from '../../../src/fetch/types/IResponse.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import CrossOriginBrowserWindow from '../../../src/window/CrossOriginBrowserWindow.js';
import MessageEvent from '../../../src/event/events/MessageEvent.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import DOMException from '../../../src/exception/DOMException.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import IRequestInfo from '../../../src/fetch/types/IRequestInfo.js';
import Headers from '../../../src/fetch/Headers.js';
import Browser from '../../../src/browser/Browser.js';

describe('HTMLIFrameElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLIFrameElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLIFrameElement>document.createElement('iframe');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLIFrameElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLIFrameElement]');
		});
	});

	for (const property of ['src', 'allow', 'height', 'width', 'name', 'sandbox', 'srcdoc']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('get contentWindow()', () => {
		it('Returns content window for "about:blank".', () => {
			element.src = 'about:blank';
			expect(element.contentWindow).toBe(null);
			expect(element.contentDocument).toBe(null);
			document.body.appendChild(element);
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
			expect(element.contentDocument?.documentElement.innerHTML).toBe('<head></head><body></body>');
		});

		it('Returns content window for "javascript:scroll(10, 20)".', async () => {
			await new Promise((resolve) => {
				element.src = 'javascript:scroll(10, 20)';
				document.body.appendChild(element);
				expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);

				element.addEventListener('load', () => {
					expect(element.contentDocument?.documentElement.scrollLeft).toBe(10);
					expect(element.contentDocument?.documentElement.scrollTop).toBe(20);
					resolve(null);
				});
			});
		});

		it(`Does'nt load anything if the Happy DOM setting "disableIframePageLoading" is set to true.`, () => {
			const browser = new Browser({ settings: { disableIframePageLoading: true } });
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <IHTMLIFrameElement>document.createElement('iframe');

			element.src = 'https://localhost:8080/iframe.html';
			document.body.appendChild(element);
			expect(element.contentWindow === null).toBe(true);
			expect(element.contentDocument === null).toBe(true);
		});

		it(`Dispatches an error event if the response of the iframe page has an "x-frame-options" header set to "deny".`, async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(<IResponse>(<unknown>{
								text: () => Promise.resolve(responseHTML),
								ok: true,
								headers: new Headers({ 'x-frame-options': 'deny' })
							}));
						}, 1);
					});
				});

				window.happyDOM?.setURL('https://localhost:8080');
				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('error', (event) => {
					expect((<ErrorEvent>event).message).toBe(
						`Refused to display 'https://localhost:8080/iframe.html' in a frame because it set 'X-Frame-Options' to 'deny'.`
					);
					expect((<ErrorEvent>event).message === (<ErrorEvent>event).error?.message).toBe(true);
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});

		it(`Dispatches an error event if the response of the iframe page has an "x-frame-options" header set to "sameorigin" when the origin is different.`, async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(<IResponse>(<unknown>{
								text: () => Promise.resolve(responseHTML),
								ok: true,
								headers: new Headers({ 'x-frame-options': 'sameorigin' })
							}));
						}, 1);
					});
				});

				window.happyDOM?.setURL('https://localhost:3000');
				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('error', (event) => {
					expect((<ErrorEvent>event).message).toBe(
						`Refused to display 'https://localhost:8080/iframe.html' in a frame because it set 'X-Frame-Options' to 'sameorigin'.`
					);
					expect((<ErrorEvent>event).message === (<ErrorEvent>event).error?.message).toBe(true);
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});

		it('Returns content window for URL with same origin when the response has an "x-frame-options" set to "sameorigin".', async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(<IResponse>(<unknown>{
								text: () => Promise.resolve(responseHTML),
								ok: true,
								headers: new Headers({ 'x-frame-options': 'sameorigin' })
							}));
						}, 1);
					});
				});

				window.happyDOM?.setURL('https://localhost:8080');
				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('load', () => {
					expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
					expect(fetchedURL).toBe('https://localhost:8080/iframe.html');
					expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
					expect(`<html>${element.contentDocument?.documentElement.innerHTML}</html>`).toBe(
						responseHTML
					);
					resolve(null);
				});

				document.body.appendChild(element);
			});
		});

		it('Returns content window for URL with same origin.', async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.resolve(responseHTML),
						ok: true,
						headers: new Headers()
					}));
				});

				window.happyDOM?.setURL('https://localhost:8080');
				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('load', () => {
					expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
					expect(fetchedURL).toBe('https://localhost:8080/iframe.html');
					expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
					expect(`<html>${element.contentDocument?.documentElement.innerHTML}</html>`).toBe(
						responseHTML
					);
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});

		it('Returns content window for relative URL.', async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.resolve(responseHTML),
						ok: true,
						headers: new Headers()
					}));
				});

				window.happyDOM?.setURL('https://localhost:8080');
				element.src = '/iframe.html';
				element.addEventListener('load', () => {
					expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});

		it('Returns content window for without protocol.', async () => {
			await new Promise((resolve) => {
				const browser = new Browser();
				const page = browser.newPage();
				const window = page.mainFrame.window;
				const document = window.document;
				const element = <IHTMLIFrameElement>document.createElement('iframe');
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				page.mainFrame.url = 'https://localhost:8080';

				vi.spyOn(Window.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.resolve(responseHTML),
						ok: true,
						headers: new Headers()
					}));
				});

				element.src = '//www.github.com/iframe.html';
				element.addEventListener('load', () => {
					expect(page.mainFrame.childFrames[0].url).toBe('https://www.github.com/iframe.html');
					resolve(null);
				});

				document.body.appendChild(element);
			});
		});

		it('Returns instance of CrossOriginBrowserWindow for URL with different origin.', async () => {
			await new Promise((resolve) => {
				const browser = new Browser();
				const page = browser.newPage();
				const window = page.mainFrame.window;
				const document = window.document;
				const element = <IHTMLIFrameElement>document.createElement('iframe');
				const iframeOrigin = 'https://other.origin.com';
				const iframeSrc = iframeOrigin + '/iframe.html';
				const documentOrigin = 'https://localhost:8080';
				let fetchedURL: string | null = null;

				page.mainFrame.url = documentOrigin;

				vi.spyOn(Window.prototype, 'fetch').mockImplementation(
					(url: IRequestInfo): Promise<IResponse> => {
						fetchedURL = <string>url;
						return new Promise((resolve) => {
							setTimeout(() => {
								resolve(<IResponse>(<unknown>{
									text: () => Promise.resolve('<html><head></head><body>Test</body></html>'),
									ok: true,
									headers: new Headers()
								}));
							}, 1);
						});
					}
				);

				document.body.appendChild(element);
				element.src = iframeSrc;
				element.addEventListener('load', () => {
					const message = 'test';
					let triggeredEvent: MessageEvent | null = null;
					expect(fetchedURL).toBe(iframeSrc);
					expect(element.contentWindow instanceof CrossOriginBrowserWindow).toBe(true);
					expect(() => element.contentWindow?.location.href).toThrowError(
						new DOMException(
							`Blocked a frame with origin "${documentOrigin}" from accessing a cross-origin frame.`,
							DOMExceptionNameEnum.securityError
						)
					);
					expect(element.contentWindow?.self === element.contentWindow).toBe(true);
					expect(element.contentWindow?.window === element.contentWindow).toBe(true);
					expect(element.contentWindow?.parent === window).toBe(true);
					expect(element.contentWindow?.top === window).toBe(true);
					page.mainFrame.childFrames[0].window.addEventListener(
						'message',
						(event) => (triggeredEvent = <MessageEvent>event)
					);
					element.contentWindow?.postMessage(message, iframeOrigin);
					expect(triggeredEvent).toBe(null);

					setTimeout(() => {
						expect(element.contentDocument).toBe(null);
						expect((<MessageEvent>triggeredEvent).data).toBe(message);
						expect((<MessageEvent>triggeredEvent).origin).toBe(documentOrigin);
						expect((<MessageEvent>triggeredEvent).source === window).toBe(true);
						expect((<MessageEvent>triggeredEvent).lastEventId).toBe('');
						resolve(null);
					}, 10);
				});
			});
		});

		it('Dispatches an error event when the page fails to load.', async () => {
			await new Promise((resolve) => {
				const error = new Error('Error');

				vi.spyOn(Window.prototype, 'fetch').mockImplementation(() => {
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.reject(error),
						ok: true,
						headers: new Headers()
					}));
				});

				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('error', (event) => {
					expect((<ErrorEvent>event).message).toBe(error.message);
					expect((<ErrorEvent>event).error).toBe(error);
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});
	});

	describe('get contentDocument()', () => {
		it('Returns content document for "about:blank".', () => {
			element.src = 'about:blank';
			expect(element.contentDocument).toBe(null);
			document.body.appendChild(element);
			expect(element.contentDocument?.documentElement.innerHTML).toBe('<head></head><body></body>');
		});
	});
});
