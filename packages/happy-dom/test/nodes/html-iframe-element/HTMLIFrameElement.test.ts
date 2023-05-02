import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLIFrameElement from '../../../src/nodes/html-iframe-element/IHTMLIFrameElement';
import IResponse from '../../../src/fetch/types/IResponse';
import ErrorEvent from '../../../src/event/events/ErrorEvent';
import IFrameCrossOriginWindow from '../../../src/nodes/html-iframe-element/IFrameCrossOriginWindow';
import MessageEvent from '../../../src/event/events/MessageEvent';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum';
import DOMException from '../../../src/exception/DOMException';

describe('HTMLIFrameElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLIFrameElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLIFrameElement>document.createElement('iframe');
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
			expect(element.contentWindow === element.contentDocument.defaultView).toBe(true);
			expect(element.contentDocument.documentElement.innerHTML).toBe('<head></head><body></body>');
		});

		it('Returns content window for "javascript:scroll(10, 20)".', () => {
			element.src = 'javascript:scroll(10, 20)';
			document.body.appendChild(element);
			expect(element.contentWindow === element.contentDocument.defaultView).toBe(true);
			expect(element.contentDocument.documentElement.scrollLeft).toBe(10);
			expect(element.contentDocument.documentElement.scrollTop).toBe(20);
		});

		it('Returns content window for URL with same origin.', (done) => {
			const responseHTML = '<html><head></head><body>Test</body></html>';
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve(responseHTML),
					ok: true
				});
			});

			window.happyDOM.setURL('https://localhost:8080');
			element.src = 'https://localhost:8080/iframe.html';
			element.addEventListener('load', () => {
				expect(fetchedURL).toBe('https://localhost:8080/iframe.html');
				expect(element.contentWindow === element.contentDocument.defaultView).toBe(true);
				expect(`<html>${element.contentDocument.documentElement.innerHTML}</html>`).toBe(
					responseHTML
				);
				done();
			});
			document.body.appendChild(element);
		});

		it('Returns instance of IFrameCrossOriginWindow for URL with different origin.', (done) => {
			const iframeOrigin = 'https://other.origin.com';
			const iframeSrc = iframeOrigin + '/iframe.html';
			const documentOrigin = 'https://localhost:8080';
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('<html><head></head><body>Test</body></html>'),
					ok: true
				});
			});

			window.happyDOM.setURL(documentOrigin);
			element.src = iframeSrc;
			element.addEventListener('load', () => {
				const message = 'test';
				let triggeredEvent: MessageEvent | null = null;
				expect(fetchedURL).toBe(iframeSrc);
				expect(element.contentWindow instanceof IFrameCrossOriginWindow).toBe(true);
				expect(() => element.contentWindow.location.href).toThrowError(
					new DOMException(
						`Blocked a frame with origin "${documentOrigin}" from accessing a cross-origin frame.`,
						DOMExceptionNameEnum.securityError
					)
				);
				expect(element.contentWindow.self === element.contentWindow).toBe(true);
				expect(element.contentWindow.window === element.contentWindow).toBe(true);
				expect(element.contentWindow.parent === window).toBe(true);
				expect(element.contentWindow.top === window).toBe(true);
				element.contentWindow['_targetWindow'].addEventListener(
					'message',
					(event: MessageEvent) => (triggeredEvent = event)
				);
				element.contentWindow.postMessage(message, iframeOrigin);
				expect(element.contentDocument).toBe(null);
				expect(triggeredEvent.data).toBe(message);
				expect(triggeredEvent.origin).toBe(documentOrigin);
				expect(triggeredEvent.source === window).toBe(true);
				expect(triggeredEvent.lastEventId).toBe('');
				done();
			});
			document.body.appendChild(element);
		});

		it('Dispatches an error event when the page fails to load.', (done) => {
			const error = new Error('Error');

			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve(<IResponse>{
					text: () => Promise.reject(error),
					ok: true
				});
			});

			element.src = 'https://localhost:8080/iframe.html';
			element.addEventListener('error', (event: ErrorEvent) => {
				expect(event.message).toBe(error.message);
				expect(event.error).toBe(error);
				done();
			});
			document.body.appendChild(element);
		});
	});

	describe('get contentDocument()', () => {
		it('Returns content document for "about:blank".', () => {
			element.src = 'about:blank';
			expect(element.contentDocument).toBe(null);
			document.body.appendChild(element);
			expect(element.contentDocument.documentElement.innerHTML).toBe('<head></head><body></body>');
		});
	});
});
