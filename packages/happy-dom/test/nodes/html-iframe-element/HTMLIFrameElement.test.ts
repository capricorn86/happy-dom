import Window from '../../../src/window/Window.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLIFrameElement from '../../../src/nodes/html-iframe-element/HTMLIFrameElement.js';
import Response from '../../../src/fetch/Response.js';
import ErrorEvent from '../../../src/event/events/ErrorEvent.js';
import CrossOriginBrowserWindow from '../../../src/window/CrossOriginBrowserWindow.js';
import MessageEvent from '../../../src/event/events/MessageEvent.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import DOMException from '../../../src/exception/DOMException.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import IRequestInfo from '../../../src/fetch/types/IRequestInfo.js';
import Headers from '../../../src/fetch/Headers.js';
import Browser from '../../../src/browser/Browser.js';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';
import Event from '../../../src/event/Event.js';

describe('HTMLIFrameElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLIFrameElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLIFrameElement>document.createElement('iframe');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLIFrameElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLIFrameElement]');
		});
	});

	for (const event of ['load', 'error']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	for (const property of ['allow', 'height', 'width', 'name']) {
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

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});
	});

	describe('get sandbox()', () => {
		it('Returns DOMTokenList', () => {
			expect(element.sandbox).toBeInstanceOf(DOMTokenList);
			element.sandbox.add('allow-forms', 'allow-scripts');
			expect(element.sandbox.toString()).toBe('allow-forms allow-scripts');
		});

		it('Returns values from attribute', () => {
			element.setAttribute('sandbox', 'allow-forms allow-scripts');
			expect(element.sandbox.toString()).toBe('allow-forms allow-scripts');
		});
	});

	describe('set sandbox()', () => {
		it('Sets attribute', () => {
			element.sandbox = 'allow-forms allow-scripts';
			expect(element.getAttribute('sandbox')).toBe('allow-forms allow-scripts');

			element.sandbox =
				'allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols';
			expect(element.sandbox.toString()).toBe(
				'allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols'
			);
		});

		it('Updates the DOMTokenList indicies when setting the sandbox attribute', () => {
			element.sandbox = 'allow-forms allow-scripts';
			expect(element.sandbox.length).toBe(2);
			expect(element.sandbox[0]).toBe('allow-forms');
			expect(element.sandbox[1]).toBe('allow-scripts');

			element.sandbox = 'allow-scripts allow-forms';
			expect(element.sandbox.length).toBe(2);
			expect(element.sandbox[0]).toBe('allow-scripts');
			expect(element.sandbox[1]).toBe('allow-forms');

			element.sandbox = 'allow-forms';
			expect(element.sandbox.length).toBe(1);
			expect(element.sandbox[0]).toBe('allow-forms');
			expect(element.sandbox[1]).toBe(undefined);

			element.sandbox = '';

			expect(element.sandbox.length).toBe(0);
			expect(element.sandbox[0]).toBe(undefined);

			element.sandbox = 'allow-forms allow-scripts allow-forms';
			expect(element.sandbox.length).toBe(2);
			expect(element.sandbox[0]).toBe('allow-forms');
			expect(element.sandbox[1]).toBe('allow-scripts');

			element.sandbox = 'allow-forms allow-scripts allow-modals';
			expect(element.sandbox.length).toBe(3);
			expect(element.sandbox[0]).toBe('allow-forms');
			expect(element.sandbox[1]).toBe('allow-scripts');
			expect(element.sandbox[2]).toBe('allow-modals');
		});

		it('Console error occurs when add an invalid sandbox flag', () => {
			element.sandbox = 'invalid';
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`Error while parsing the 'sandbox' attribute: 'invalid' is an invalid sandbox flag.\n`
			);
			expect(element.sandbox.toString()).toBe('invalid');
			expect(element.getAttribute('sandbox')).toBe('invalid');

			element.setAttribute('sandbox', 'first-invalid second-invalid');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`Error while parsing the 'sandbox' attribute: 'first-invalid', 'second-invalid' are invalid sandbox flags.\n`
			);
			expect(element.sandbox.toString()).toBe('first-invalid second-invalid');
			expect(element.getAttribute('sandbox')).toBe('first-invalid second-invalid');
		});
	});

	describe('get srcdoc()', () => {
		it('Returns string', () => {
			expect(element.srcdoc).toBe('');
			element.srcdoc = '<div></div>';
			expect(element.getAttribute('srcdoc')).toBe('<div></div>');
		});
	});

	describe('set srcdoc()', () => {
		it("Navigate the element's browsing context to a resource whose Content-Type is text/html", async () => {
			const actualHTML = await new Promise((resolve) => {
				element.srcdoc = '<div>TEST</div>';
				element.addEventListener('load', () => {
					resolve(element.contentDocument?.documentElement.innerHTML);
				});
				document.body.appendChild(element);
			});
			expect(actualHTML).toBe('<head></head><body><div>TEST</div></body>');
		});

		it('Takes priority, when the src attribute and the srcdoc attribute are both specified together', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <HTMLIFrameElement>document.createElement('iframe');
			const url = await new Promise((resolve) => {
				element.srcdoc = '<html><head></head><body>TEST</body></html>';
				element.src = 'https://localhost:8080/iframe.html';
				element.addEventListener('load', () => {
					resolve(page.mainFrame.childFrames[0].url);
				});
				document.body.appendChild(element);
			});
			expect(url).toBe('about:srcdoc');
		});

		it('Resolve the value of the src attribute when the srcdoc attribute has been removed', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <HTMLIFrameElement>document.createElement('iframe');
			page.mainFrame.url = 'https://localhost:8080';
			const responseHTML = '<html><head></head><body>Test</body></html>';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve(responseHTML),
					ok: true,
					headers: new Headers()
				}));
			});
			const frameUrl = 'https://localhost:8080/iframe.html';
			const actualFrameUrl = await new Promise((resolve) => {
				element.srcdoc = responseHTML;
				element.src = frameUrl;
				const firstLoad = (): void => {
					expect(page.mainFrame.childFrames[0].url).toBe('about:srcdoc');
					element.removeEventListener('load', firstLoad);
					element.addEventListener('load', () => {
						resolve(page.mainFrame.childFrames[0].url);
					});
					element.removeAttribute('srcdoc');
				};
				element.addEventListener('load', firstLoad);
				document.body.appendChild(element);
			});
			expect(actualFrameUrl).toBe(frameUrl);
		});

		it('Execute code in the script', async () => {
			const message = await new Promise((resolve) => {
				element.srcdoc = `<!doctype html><html><head>
				<script>
				function handleMessage(e) {
					parent.postMessage({ msg: 'loaded' }, '*');
				}
				window.addEventListener('message', handleMessage, false);
				</script>
				</head><body></body></html>`;
				element.addEventListener('load', () => {
					element.contentWindow?.postMessage('MESSAGE', '*');
				});
				window.addEventListener(
					'message',
					(e) => {
						const data = (<MessageEvent>e).data;
						resolve(data);
					},
					false
				);
				document.body.appendChild(element);
				expect(element.contentWindow?.parent === window).toBe(true);
			});
			expect(message).toMatchObject({ msg: 'loaded' });
		});
	});

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
			element.src = 'javascript:scroll(10, 20)';
			document.body.appendChild(element);
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);

			await new Promise((resolve) => {
				element.addEventListener('load', (event) => {
					resolve(event);
				});
			});

			expect(element.contentDocument?.documentElement.scrollLeft).toBe(10);
			expect(element.contentDocument?.documentElement.scrollTop).toBe(20);
		});

		it(`Doesn't load anything if the Happy DOM setting "disableIframePageLoading" is set to true.`, () => {
			const browser = new Browser({ settings: { disableIframePageLoading: true } });
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <HTMLIFrameElement>document.createElement('iframe');

			element.src = 'https://localhost:8080/iframe.html';
			document.body.appendChild(element);
			expect(element.contentWindow === null).toBe(true);
			expect(element.contentDocument === null).toBe(true);
		});

		it(`Dispatches an error event if the response of the iframe page has an "x-frame-options" header set to "deny".`, async () => {
			const responseHTML = '<html><head></head><body>Test</body></html>';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(<Response>(<unknown>{
							text: () => Promise.resolve(responseHTML),
							ok: true,
							headers: new Headers({ 'x-frame-options': 'deny' })
						}));
					}, 1);
				});
			});

			window.happyDOM?.setURL('https://localhost:8080');
			element.src = 'https://localhost:8080/iframe.html';

			document.body.appendChild(element);

			const event: Event = await new Promise((resolve) => {
				element.addEventListener('error', (event) => {
					resolve(event);
				});
			});

			expect(event.type).toBe('error');

			expect(
				window.happyDOM.virtualConsolePrinter
					.readAsString()
					.startsWith(
						`Error: Refused to display 'https://localhost:8080/iframe.html' in a frame because it set 'X-Frame-Options' to 'deny'.`
					)
			).toBe(true);
		});

		it(`Dispatches an error event if the response of the iframe page has an "x-frame-options" header set to "sameorigin" when the origin is different.`, async () => {
			const responseHTML = '<html><head></head><body>Test</body></html>';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(<Response>(<unknown>{
							text: () => Promise.resolve(responseHTML),
							ok: true,
							headers: new Headers({ 'x-frame-options': 'sameorigin' })
						}));
					}, 1);
				});
			});

			window.happyDOM?.setURL('https://localhost:3000');
			element.src = 'https://localhost:8080/iframe.html';

			document.body.appendChild(element);

			const event: Event = await new Promise((resolve) => {
				element.addEventListener('error', (event) => {
					resolve(event);
				});
			});

			expect(event.type).toBe('error');

			expect(
				window.happyDOM.virtualConsolePrinter
					.readAsString()
					.startsWith(
						`Error: Refused to display 'https://localhost:8080/iframe.html' in a frame because it set 'X-Frame-Options' to 'sameorigin'.`
					)
			).toBe(true);
		});

		it('Returns content window for URL with same origin when the response has an "x-frame-options" set to "sameorigin".', async () => {
			const responseHTML = '<html><head></head><body>Test</body></html>';
			let fetchedURL: string | null = null;

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				fetchedURL = <string>url;
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(<Response>(<unknown>{
							text: () => Promise.resolve(responseHTML),
							ok: true,
							headers: new Headers({ 'x-frame-options': 'sameorigin' })
						}));
					}, 1);
				});
			});

			window.happyDOM?.setURL('https://localhost:8080');
			element.src = 'https://localhost:8080/iframe.html';

			document.body.appendChild(element);

			await new Promise((resolve) => {
				element.addEventListener('load', () => {
					resolve(null);
				});
			});

			expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
			expect(fetchedURL).toBe('https://localhost:8080/iframe.html');
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
			expect(`<html>${element.contentDocument?.documentElement.innerHTML}</html>`).toBe(
				responseHTML
			);
		});

		it('Returns content window for URL with same origin.', async () => {
			const responseHTML = '<html><head></head><body>Test</body></html>';
			let fetchedURL: string | null = null;

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				fetchedURL = <string>url;
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve(responseHTML),
					ok: true,
					headers: new Headers()
				}));
			});

			window.happyDOM?.setURL('https://localhost:8080');
			element.src = 'https://localhost:8080/iframe.html';

			document.body.appendChild(element);

			await new Promise((resolve) => {
				element.addEventListener('load', () => {
					resolve(null);
				});
			});

			expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
			expect(fetchedURL).toBe('https://localhost:8080/iframe.html');
			expect(element.contentWindow === element.contentDocument?.defaultView).toBe(true);
			expect(`<html>${element.contentDocument?.documentElement.innerHTML}</html>`).toBe(
				responseHTML
			);
		});

		it('Returns content window for relative URL.', async () => {
			const responseHTML = '<html><head></head><body>Test</body></html>';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve(responseHTML),
					ok: true,
					headers: new Headers()
				}));
			});

			window.happyDOM?.setURL('https://localhost:8080');
			element.src = '/iframe.html';

			document.body.appendChild(element);

			await new Promise((resolve) => {
				element.addEventListener('load', () => {
					resolve(null);
				});
			});

			expect(element.contentDocument?.location.href).toBe('https://localhost:8080/iframe.html');
		});

		it('Returns content window for URL without protocol.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <HTMLIFrameElement>document.createElement('iframe');
			const responseHTML = '<html><head></head><body>Test</body></html>';

			page.mainFrame.url = 'https://localhost:8080';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve(responseHTML),
					ok: true,
					headers: new Headers()
				}));
			});

			element.src = '//www.github.com/iframe.html';

			document.body.appendChild(element);

			await new Promise((resolve) => {
				element.addEventListener('load', () => {
					resolve(null);
				});
			});

			expect(page.mainFrame.childFrames[0].url).toBe('https://www.github.com/iframe.html');
		});

		it('Returns instance of CrossOriginBrowserWindow for URL with different origin.', async () => {
			await new Promise((resolve) => {
				const browser = new Browser();
				const page = browser.newPage();
				const window = page.mainFrame.window;
				const document = window.document;
				const element = <HTMLIFrameElement>document.createElement('iframe');
				const iframeOrigin = 'https://other.origin.com';
				const iframeSrc = iframeOrigin + '/iframe.html';
				const documentOrigin = 'https://localhost:8080';
				let fetchedURL: string | null = null;

				page.mainFrame.url = documentOrigin;

				vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation(
					(url: IRequestInfo): Promise<Response> => {
						fetchedURL = <string>url;
						return new Promise((resolve) => {
							setTimeout(() => {
								resolve(<Response>(<unknown>{
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
			const error = new Error('error');

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation(() => {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.reject(error),
					ok: true,
					headers: new Headers()
				}));
			});

			element.src = 'https://localhost:8080/iframe.html';
			document.body.appendChild(element);

			const event: Event = await new Promise((resolve) => {
				element.addEventListener('error', (event) => {
					resolve(event);
				});
			});

			expect(event.type).toBe('error');

			expect(
				window.happyDOM.virtualConsolePrinter.readAsString().startsWith(`Error: error\n`)
			).toBe(true);
		});

		it('Remain at the initial about:blank page when none of the srcdoc/src attributes are set', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			const element = <HTMLIFrameElement>document.createElement('iframe');
			page.mainFrame.url = 'https://localhost:8080';

			vi.spyOn(BrowserWindow.prototype, 'fetch').mockImplementation((url: IRequestInfo) => {
				return Promise.resolve(<Response>(<unknown>{
					text: () => Promise.resolve('<html><head></head><body>Test</body></html>'),
					ok: true,
					headers: new Headers()
				}));
			});
			const actualFrameUrl = await new Promise((resolve) => {
				element.src = 'https://localhost:8080/iframe.html';
				const firstLoad = (): void => {
					element.removeEventListener('load', firstLoad);
					element.addEventListener('load', () => {
						resolve(page.mainFrame.childFrames[0].url);
					});
					element.removeAttribute('src');
				};
				element.addEventListener('load', firstLoad);
				document.body.appendChild(element);
			});
			expect(actualFrameUrl).toBe('about:blank');
		});
	});

	describe('get contentDocument()', () => {
		it('Returns content document for "about:blank".', () => {
			element.src = 'about:blank';
			expect(element.contentDocument).toBe(null);
			document.body.appendChild(element);
			expect(element.contentWindow?.parent === window).toBe(true);
			expect(element.contentDocument?.documentElement.innerHTML).toBe('<head></head><body></body>');
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('iframe');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('iframe');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('iframe');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('iframe');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
		});
	});
});
