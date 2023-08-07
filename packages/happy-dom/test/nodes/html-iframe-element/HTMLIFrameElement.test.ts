import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IHTMLIFrameElement from '../../../src/nodes/html-iframe-element/IHTMLIFrameElement.js';
import IResponse from '../../../src/fetch/types/IResponse.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import IFrameCrossOriginWindow from '../../../src/nodes/html-iframe-element/IFrameCrossOriginWindow.js';
import MessageEvent from '../../../src/event/events/MessageEvent.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import DOMException from '../../../src/exception/DOMException.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import IRequestInfo from '../../../src/fetch/types/IRequestInfo.js';

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
			expect(element.contentDocument).toBe(null);
			document.body.appendChild(element);
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
			expect(element.contentDocument?.documentElement.innerHTML).toBe('<head></head><body></body>');
		});

		it('Returns content window for "javascript:scroll(10, 20)".', () => {
			element.src = 'javascript:scroll(10, 20)';
			document.body.appendChild(element);
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
			expect(element.contentDocument?.documentElement.scrollLeft).toBe(10);
			expect(element.contentDocument?.documentElement.scrollTop).toBe(20);
		});

		it('Returns content window for URL with same origin.', async () => {
			await new Promise((resolve) => {
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>{
						text: () => Promise.resolve(responseHTML),
						ok: true
					});
				});

				window.happyDOM.setURL('https://localhost:8080');
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

				vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>{
						text: () => Promise.resolve(responseHTML),
						ok: true
					});
				});

				window.happyDOM.setURL('https://localhost:8080');
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
				const responseHTML = '<html><head></head><body>Test</body></html>';
				let fetchedURL: string | null = null;

				vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo) => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>{
						text: () => Promise.resolve(responseHTML),
						ok: true
					});
				});

				window.happyDOM.setURL('https://localhost:8080');
				element.src = '//www.github.com/iframe.html';
				element.addEventListener('load', () => {
					expect((<IWindow>element.contentWindow?.['_targetWindow']).document.location.href).toBe(
						'https://www.github.com/iframe.html'
					);
					resolve(null);
				});
				document.body.appendChild(element);
			});
		});

		it('Returns instance of IFrameCrossOriginWindow for URL with different origin.', async () => {
			await new Promise((resolve) => {
				const iframeOrigin = 'https://other.origin.com';
				const iframeSrc = iframeOrigin + '/iframe.html';
				const documentOrigin = 'https://localhost:8080';
				let fetchedURL: string | null = null;

				vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo): Promise<IResponse> => {
					fetchedURL = <string>url;
					return Promise.resolve(<IResponse>{
						text: () => Promise.resolve('<html><head></head><body>Test</body></html>'),
						ok: true
					});
				});

				window.happyDOM.setURL(documentOrigin);
				document.body.appendChild(element);
				element.src = iframeSrc;
				element.addEventListener('load', () => {
					const message = 'test';
					let triggeredEvent: MessageEvent | null = null;
					expect(fetchedURL).toBe(iframeSrc);
					expect(element.contentWindow instanceof IFrameCrossOriginWindow).toBe(true);
					expect(() => element.contentWindow?.location.href).toThrowError(
						new DOMException(
							`Blocked a frame with origin "${documentOrigin}" from accessing a cross-origin frame.`,
							DOMExceptionNameEnum.securityError
						)
					);
					const targetWindow = <IWindow>(
						(<IWindow | IFrameCrossOriginWindow>element.contentWindow)['_targetWindow']
					);
					expect(element.contentWindow?.self === element.contentWindow).toBe(true);
					expect(element.contentWindow?.window === element.contentWindow).toBe(true);
					expect(element.contentWindow?.parent === window).toBe(true);
					expect(element.contentWindow?.top === window).toBe(true);
					targetWindow.addEventListener(
						'message',
						(event: MessageEvent) => (triggeredEvent = event)
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

				vi.spyOn(window, 'fetch').mockImplementation(() => {
					return Promise.resolve(<IResponse>{
						text: () => Promise.reject(error),
						ok: true
					});
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
