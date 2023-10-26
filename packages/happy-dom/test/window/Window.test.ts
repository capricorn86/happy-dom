import CSSStyleDeclaration from '../../src/css/declaration/CSSStyleDeclaration.js';
import IDocument from '../../src/nodes/document/IDocument.js';
import IHTMLLinkElement from '../../src/nodes/html-link-element/IHTMLLinkElement.js';
import IHTMLElement from '../../src/nodes/html-element/IHTMLElement.js';
import ResourceFetch from '../../src/fetch/ResourceFetch.js';
import IHTMLScriptElement from '../../src/nodes/html-script-element/IHTMLScriptElement.js';
import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import Headers from '../../src/fetch/Headers.js';
import Selection from '../../src/selection/Selection.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import CustomElement from '../../test/CustomElement.js';
import Request from '../../src/fetch/Request.js';
import Response from '../../src/fetch/Response.js';
import IRequest from '../../src/fetch/types/IRequest.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import Fetch from '../../src/fetch/Fetch.js';
import HTTP from 'http';
import Stream from 'stream';
import MessageEvent from '../../src/event/events/MessageEvent.js';
import Event from '../../src/event/Event.js';
import ErrorEvent from '../../src/event/events/ErrorEvent.js';
import '../types.d.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import VirtualConsole from '../../src/console/VirtualConsole.js';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter.js';
import PackageVersion from '../../src/version.js';
import { IHTMLDialogElement } from '../../src/index.js';

const GET_NAVIGATOR_PLATFORM = (): string => {
	return (
		'X11; ' +
		process.platform.charAt(0).toUpperCase() +
		process.platform.slice(1) +
		' ' +
		process.arch
	);
};

describe('Window', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Is able to handle multiple instances of Window', () => {
			const firstWindow = new Window({ url: 'https://localhost:8080' });
			const secondWindow = new Window({ url: 'https://localhost:8080' });
			const thirdWindow = new Window({ url: 'https://localhost:8080' });

			for (const className of [
				'Response',
				'Request',
				'Image',
				'FileReader',
				'DOMParser',
				'Range'
			]) {
				const input = className === 'Request' ? 'test' : undefined;
				const thirdInstance = new thirdWindow[className](input);
				const firstInstance = new firstWindow[className](input);
				const secondInstance = new secondWindow[className](input);
				const property = className === 'Image' ? 'ownerDocument' : '_ownerDocument';

				expect(firstInstance[property] === firstWindow.document).toBe(true);
				expect(secondInstance[property] === secondWindow.document).toBe(true);
				expect(thirdInstance[property] === thirdWindow.document).toBe(true);
			}

			const thirdElement = thirdWindow.document.createElement('div');
			const firstElement = firstWindow.document.createElement('div');
			const secondElement = secondWindow.document.createElement('div');

			expect(firstElement.ownerDocument === firstWindow.document).toBe(true);
			expect(secondElement.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdElement.ownerDocument === thirdWindow.document).toBe(true);

			const thirdText = thirdWindow.document.createTextNode('Test');
			const firstText = firstWindow.document.createTextNode('Test');
			const secondText = secondWindow.document.createTextNode('Test');

			expect(firstText.ownerDocument === firstWindow.document).toBe(true);
			expect(secondText.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdText.ownerDocument === thirdWindow.document).toBe(true);

			const thirdComment = thirdWindow.document.createComment('Test');
			const firstComment = firstWindow.document.createComment('Test');
			const secondComment = secondWindow.document.createComment('Test');

			expect(firstComment.ownerDocument === firstWindow.document).toBe(true);
			expect(secondComment.ownerDocument === secondWindow.document).toBe(true);
			expect(thirdComment.ownerDocument === thirdWindow.document).toBe(true);
		});

		it('Initializes by using given options.', () => {
			const windowWithOptions = new Window({
				width: 1920,
				height: 1080,
				url: 'http://localhost:8080',
				console: globalThis.console,
				settings: {
					disableJavaScriptEvaluation: true,
					navigator: {
						userAgent: 'test'
					},
					device: {
						prefersColorScheme: 'dark'
					}
				}
			});
			const windowWithoutOptions = new Window();

			expect(windowWithOptions.innerWidth).toBe(1920);
			expect(windowWithOptions.innerHeight).toBe(1080);
			expect(windowWithOptions.outerWidth).toBe(1920);
			expect(windowWithOptions.outerHeight).toBe(1080);
			expect(windowWithOptions.console).toBe(globalThis.console);
			expect(windowWithOptions.location.href).toBe('http://localhost:8080/');
			expect(windowWithOptions.happyDOM.virtualConsolePrinter).toBe(null);
			expect(windowWithOptions.happyDOM.settings.disableJavaScriptEvaluation).toBe(true);
			expect(windowWithOptions.happyDOM.settings.disableJavaScriptFileLoading).toBe(false);
			expect(windowWithOptions.happyDOM.settings.disableCSSFileLoading).toBe(false);
			expect(windowWithOptions.happyDOM.settings.disableIframePageLoading).toBe(false);
			expect(windowWithOptions.happyDOM.settings.disableErrorCapturing).toBe(false);
			expect(windowWithOptions.happyDOM.settings.enableFileSystemHttpRequests).toBe(false);
			expect(windowWithOptions.happyDOM.settings.navigator.userAgent).toBe('test');
			expect(windowWithOptions.happyDOM.settings.device.prefersColorScheme).toBe('dark');
			expect(windowWithOptions.happyDOM.settings.device.mediaType).toBe('screen');

			expect(windowWithoutOptions.innerWidth).toBe(1024);
			expect(windowWithoutOptions.innerHeight).toBe(768);
			expect(windowWithoutOptions.outerWidth).toBe(1024);
			expect(windowWithoutOptions.outerHeight).toBe(768);
			expect(windowWithoutOptions.console).toBeInstanceOf(VirtualConsole);
			expect(windowWithoutOptions.location.href).toBe('about:blank');
			expect(windowWithoutOptions.happyDOM.virtualConsolePrinter).toBeInstanceOf(
				VirtualConsolePrinter
			);
			expect(windowWithoutOptions.happyDOM.settings.disableJavaScriptEvaluation).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.disableJavaScriptFileLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.disableCSSFileLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.disableIframePageLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.disableErrorCapturing).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.enableFileSystemHttpRequests).toBe(false);
			expect(windowWithoutOptions.happyDOM.settings.navigator.userAgent).toBe(
				`Mozilla/5.0 (${GET_NAVIGATOR_PLATFORM()}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${
					PackageVersion.version
				}`
			);
			expect(windowWithoutOptions.happyDOM.settings.device.prefersColorScheme).toBe('light');
			expect(windowWithoutOptions.happyDOM.settings.device.mediaType).toBe('screen');
		});

		it('Supports deprecated "innerWidth" and "innerHeight".', () => {
			const window = new Window({
				innerWidth: 1920,
				innerHeight: 1080
			});

			expect(window.innerWidth).toBe(1920);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerWidth).toBe(1920);
			expect(window.outerHeight).toBe(1080);
		});
	});

	describe('happyDOM.whenAsyncComplete()', () => {
		it('Resolves the Promise returned by whenAsyncComplete() when all async tasks has been completed.', async () => {
			const responseText = '{ "test": "test" }';
			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.statusMessage = '';
								response.headers = {
									'content-length': '0'
								};
								response.rawHeaders = ['content-length', '0'];

								setTimeout(() => callback(response));
							}
						},
						setTimeout: () => {}
					};
				}
			});

			window.location.href = 'https://localhost:8080';
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
				isFirstWhenAsyncCompleteCalled = true;
			});
			let tasksDone = 0;
			const intervalID = window.setInterval(() => {
				tasksDone++;
			});
			window.clearInterval(intervalID);
			window.setTimeout(() => {
				tasksDone++;
			});
			window.setTimeout(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.fetch('/url/1/').then((response) => {
				response.json().then(() => {
					tasksDone++;
				});
			});
			window.fetch('/url/2/').then((response) => {
				response.text().then(() => {
					tasksDone++;
				});
			});
			await window.happyDOM.whenAsyncComplete();
			expect(tasksDone).toBe(6);
			expect(isFirstWhenAsyncCompleteCalled).toBe(true);
		});
	});

	describe('happyDOM.cancelAsync()', () => {
		it('Cancels all ongoing asynchrounous tasks.', async () => {
			await new Promise((resolve) => {
				window.location.href = 'https://localhost:8080';
				let isFirstWhenAsyncCompleteCalled = false;
				window.happyDOM.whenAsyncComplete().then(() => {
					isFirstWhenAsyncCompleteCalled = true;
				});
				let tasksDone = 0;
				const intervalID = window.setInterval(() => {
					tasksDone++;
				});
				window.clearInterval(intervalID);
				window.setTimeout(() => {
					tasksDone++;
				});
				window.setTimeout(() => {
					tasksDone++;
				});
				window.requestAnimationFrame(() => {
					tasksDone++;
				});
				window.requestAnimationFrame(() => {
					tasksDone++;
				});

				window
					.fetch('/url/')
					.then((response) =>
						response
							.json()
							.then(() => {
								tasksDone++;
							})
							.catch(() => {})
					)
					.catch(() => {});

				window
					.fetch('/url/')
					.then((response) =>
						response
							.json()
							.then(() => {
								tasksDone++;
							})
							.catch(() => {})
					)
					.catch(() => {});

				let isSecondWhenAsyncCompleteCalled = false;
				window.happyDOM.whenAsyncComplete().then(() => {
					isSecondWhenAsyncCompleteCalled = true;
				});

				window.happyDOM.cancelAsync();

				expect(tasksDone).toBe(0);

				window.setTimeout(() => {
					expect(isFirstWhenAsyncCompleteCalled).toBe(true);
					expect(isSecondWhenAsyncCompleteCalled).toBe(true);
					resolve(null);
				}, 1);
			});
		});
	});

	describe('happyDOM.setURL()', () => {
		it('Sets URL.', () => {
			window.happyDOM.setURL('https://localhost:8080');
			expect(window.location.href).toBe('https://localhost:8080/');
		});
	});

	describe('happyDOM.virtualConsolePrinter.readAsString()', () => {
		it('Returns the buffered console output.', () => {
			window.console.log('Test 1', { key1: 'value1' });
			window.console.info('Test 2', { key2: 'value2' });

			expect(window.happyDOM.virtualConsolePrinter?.readAsString()).toBe(
				`Test 1 {"key1":"value1"}\nTest 2 {"key2":"value2"}\n`
			);
		});
	});

	describe('happyDOM.setWindowSize()', () => {
		it('Sets window width.', () => {
			window.happyDOM.setWindowSize({ width: 1920 });
			expect(window.innerWidth).toBe(1920);
			expect(window.outerWidth).toBe(1920);
		});

		it('Sets window height.', () => {
			window.happyDOM.setWindowSize({ height: 1080 });
			expect(window.innerHeight).toBe(1080);
			expect(window.outerHeight).toBe(1080);
		});

		it('Sets window width and height.', () => {
			window.happyDOM.setWindowSize({ width: 1920, height: 1080 });
			expect(window.innerWidth).toBe(1920);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerWidth).toBe(1920);
			expect(window.outerHeight).toBe(1080);
		});
	});

	describe('happyDOM.setInnerWidth()', () => {
		it('Sets window width.', () => {
			window.happyDOM.setInnerWidth(1920);
			expect(window.innerWidth).toBe(1920);
			expect(window.outerWidth).toBe(1920);
		});
	});

	describe('happyDOM.setInnerHeight()', () => {
		it('Sets window height.', () => {
			window.happyDOM.setInnerHeight(1080);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerHeight).toBe(1080);
		});
	});

	describe('get Object()', () => {
		it('Is not the same as {}.constructor when inside the VM.', () => {
			expect(typeof window.Object).toBe('function');
			expect({}.constructor).not.toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			expect(window.eval('({}).constructor === window.Object')).toBe(true);
		});
	});

	describe('get Function()', () => {
		it('Is not the same as (() => {}).constructorr when inside the VM.', () => {
			expect(typeof window.Function).toBe('function');
			expect((() => {}).constructor).not.toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			expect(window.eval('(() => {}).constructor === window.Function')).toBe(true);
		});
	});

	describe('get Array()', () => {
		it('Is not the same as [].constructorr when inside the VM.', () => {
			expect(typeof window.Array).toBe('function');
			expect([].constructor).not.toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			expect(window.eval('[].constructor === window.Array')).toBe(true);
		});
	});

	describe('get ArrayBuffer()', () => {
		it('Is defined.', () => {
			expect(typeof window.ArrayBuffer).toBe('function');
		});
	});

	describe('get Buffer()', () => {
		it('Is defined.', () => {
			expect(typeof window.Buffer).toBe('function');
		});
	});

	describe('get Headers()', () => {
		it('Returns Headers class.', () => {
			expect(window.Headers).toBe(Headers);
		});
	});

	describe('get Response()', () => {
		it('Returns Response class.', () => {
			const response = new window.Response();
			expect(response instanceof Response).toBe(true);
			expect(response['_ownerDocument']).toBe(document);
		});
	});

	describe('get Request()', () => {
		it('Returns Request class.', () => {
			const request = new window.Request('https://localhost:8080/test/page/');
			expect(request instanceof Request).toBe(true);
			expect(request['_ownerDocument']).toBe(document);
		});
	});

	describe('get performance()', () => {
		it('Exposes "performance" from the NodeJS perf_hooks package.', () => {
			expect(typeof window.performance.now()).toBe('number');
		});
	});

	describe('get crypto()', () => {
		it('Exposes "crypto" from the NodeJS crypto package.', () => {
			const array = new Uint32Array(5);
			window.crypto.getRandomValues(array);
			expect(array[0]).toBeGreaterThan(0);
			expect(array[1]).toBeGreaterThan(0);
			expect(array[2]).toBeGreaterThan(0);
			expect(array[3]).toBeGreaterThan(0);
			expect(array[4]).toBeGreaterThan(0);
		});
	});

	describe('eval()', () => {
		it('Respects direct eval.', () => {
			const result = window.eval(`
			variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return eval('variable');
			})()`);
			expect(result).toBe('locally defined');
			expect(window['variable']).toBe('globally defined');
		});

		it('Respects indirect eval.', () => {
			const result = window.eval(`
			variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);
			expect(result).toBe('globally defined');
			expect(window['variable']).toBe('globally defined');
		});

		it('Has access to the window and document.', () => {
			window.eval(`window.variable = document.characterSet;`);
			expect(window['variable']).toBe('UTF-8');
		});
	});

	describe('getComputedStyle()', () => {
		it('Handles default properties "display" and "direction".', () => {
			const element = <IHTMLElement>document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.display).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.direction).toBe('ltr');
			expect(computedStyle.display).toBe('block');
		});

		it('Handles default properties "display" on a dialog element.', () => {
			const element = <IHTMLDialogElement>document.createElement('dialog');
			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.display).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.display).toBe('none');

			element.show();

			expect(computedStyle.display).toBe('block');

			element.close();

			expect(computedStyle.display).toBe('none');
		});

		it('Returns a CSSStyleDeclaration object with computed styles that are live updated whenever the element styles are changed.', () => {
			const element = <IHTMLElement>document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			element.style.color = 'red';

			expect(computedStyle instanceof CSSStyleDeclaration).toBe(true);

			expect(computedStyle.color).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.color).toBe('red');

			element.style.color = 'green';

			expect(computedStyle.color).toBe('green');
		});

		it('Returns a CSSStyleDeclaration object with computed styles from style sheets.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setWindowSize({ width: 1024 });

			parentStyle.innerHTML = `
				div {
					font: 12px/1.5 "Helvetica Neue", Helvetica, Arial,sans-serif;
					color: red !important;
					cursor: pointer;
				}

				div span {
					border-radius: 1px !important;
                    direction: ltr;
				}

				.mySpan {
                    /* Should have higher priority because of the specifity of the rule */
                    direction: rtl;
				}

				@media (min-width: 1024px) {
					div {
						font-size: 14px;
					}
				}

				@media (max-width: ${768 / 16}rem) {
					div {
						font-size: 20px;
					}
				}
			`;

			element.className = 'mySpan';
			elementStyle.innerHTML = `
				span {
					border: 1px solid #000;
					border-radius: 2px; 
					color: green;
					cursor: default;
                    direction: ltr;
				}
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.font).toBe('14px / 1.5 "Helvetica Neue", Helvetica, Arial, sans-serif');
			expect(computedStyle.border).toBe('1px solid #000');
			expect(computedStyle.borderRadius).toBe('1px');
			expect(computedStyle.color).toBe('red');
			expect(computedStyle.cursor).toBe('default');
			expect(computedStyle.direction).toBe('rtl');
		});

		it('Returns a CSSStyleDeclaration object with computed styles from style sheets for elements in a HTMLShadowRoot.', () => {
			const element = <IHTMLElement>document.createElement('span');
			const elementStyle = document.createElement('style');
			const customElement = <CustomElement>document.createElement('custom-element');
			const elementComputedStyle = window.getComputedStyle(element);

			elementStyle.innerHTML = `
				span {
					color: green;
				}
			`;

			document.body.appendChild(elementStyle);
			document.body.appendChild(element);
			document.body.appendChild(customElement);

			const customElementComputedStyle = window.getComputedStyle(
				<IHTMLElement>customElement.shadowRoot?.querySelector('span')
			);

			// Default value on HTML is "16px Times New Roman"
			expect(elementComputedStyle.font).toBe('16px "Times New Roman"');
			expect(elementComputedStyle.color).toBe('green');

			expect(customElementComputedStyle.color).toBe('yellow');
			expect(customElementComputedStyle.font).toBe(
				'14px "Lucida Grande", Helvetica, Arial, sans-serif'
			);
		});

		it('Returns values defined by a CSS variables.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setWindowSize({ width: 1024 });

			parentStyle.innerHTML = `
                html {
                    font: 14px "Times New Roman";
                }

				div {
					--color-variable: #000;
					--border-variable: 1px solid var(--color-variable);
					--font-variable: 1rem "Tahoma";
				}
			`;

			elementStyle.innerHTML = `
				span {
					border: var(--border-variable);
					font: var(--font-variable);
                    color: var(--invalid-variable);
				}
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.border).toBe('1px solid #000');
			expect(computedStyle.font).toBe('14px "Tahoma"');
			expect(computedStyle.color).toBe('');
		});

		it('Returns a CSSStyleDeclaration object with computed styles containing "rem" and "em" measurement values converted to pixels.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setWindowSize({ width: 1024 });

			parentStyle.innerHTML = `
                html {
                    font-size: 10px;
                }

				div {
                    font-size: 1.5rem;
				}
			`;

			elementStyle.innerHTML = `
                span {
					width: 10rem;
                    height: 10em;
                }
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.width).toBe('100px');
			expect(computedStyle.height).toBe('150px');
		});

		it('Returns a CSSStyleDeclaration object with computed styles containing "%" measurement values that have not been converted, as it is not supported yet.', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setWindowSize({ width: 1024 });

			parentStyle.innerHTML = `
                html {
                    font-size: 62.5%;
                }

				div {
                    font-size: 1.5rem;
				}
			`;

			elementStyle.innerHTML = `
                span {
					width: 80%;
                    height: 10em;
                }
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			expect(computedStyle.width).toBe('80%');
			expect(computedStyle.height).toBe('150px');
		});

		it('Returns a CSSStyleDeclaration object with computed styles containing "rem" and "em" measurement values that has not been converted to pixels if Window.happyDOM.settings.disableComputedStyleRendering is set to "true".', () => {
			const parent = <IHTMLElement>document.createElement('div');
			const element = <IHTMLElement>document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			window.happyDOM.setWindowSize({ width: 1024 });

			parentStyle.innerHTML = `
                html {
                    font-size: 10px;
                }

				div {
                    font-size: 1.5rem;
				}
			`;

			elementStyle.innerHTML = `
                span {
					width: 10rem;
                    height: 10em;
                }
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parentStyle);
			document.body.appendChild(parent);

			window.happyDOM.settings.disableComputedStyleRendering = true;

			expect(computedStyle.width).toBe('10rem');
			expect(computedStyle.height).toBe('10em');
		});

		for (const measurement of [
			{ value: '100vw', result: '1024px' },
			{ value: '100vh', result: '768px' },
			{ value: '100vmin', result: '768px' },
			{ value: '100vmax', result: '1024px' },
			{ value: '1cm', result: '37.7812px' },
			{ value: '1mm', result: '3.7781px' },
			{ value: '1in', result: '96px' },
			{ value: '1pt', result: '1.3281px' },
			{ value: '1pc', result: '16px' },
			{ value: '1Q', result: '0.945px' }
		]) {
			it(`Returns a CSSStyleDeclaration object with computed styles for a "${measurement.value}" measurement value converted to pixels.`, () => {
				const element = <IHTMLElement>document.createElement('div');
				element.style.width = measurement.value;
				document.body.appendChild(element);
				expect(window.getComputedStyle(element).width).toBe(measurement.result);
			});
		}
	});

	describe('eval()', () => {
		it('Evaluates code and returns the result.', () => {
			const result = <() => number>window.eval('() => 5');
			expect(result()).toBe(5);
		});
	});

	describe('setTimeout()', () => {
		it('Sets a timeout.', async () => {
			await new Promise((resolve) => {
				const timeoutId = window.setTimeout(resolve);
				expect(timeoutId.constructor.name).toBe('Timeout');
			});
		});

		it('Sets a timeout with single argument.', async () => {
			await new Promise((resolve) => {
				const callbackArgumentOne = 'hello';
				const timeoutId = window.setTimeout(
					(message: string) => {
						expect(message).toBe(callbackArgumentOne);
						resolve(null);
					},
					0,
					callbackArgumentOne
				);
				expect(timeoutId.constructor.name).toBe('Timeout');
			});
		});

		it('Sets a timeout with multiple arguments.', async () => {
			await new Promise((resolve) => {
				const callbackArgumentOne = 'hello';
				const callbackArgumentTwo = 1337;
				const timeoutId = window.setTimeout(
					(message: string, num: number) => {
						expect(message).toBe(callbackArgumentOne);
						expect(num).toBe(callbackArgumentTwo);
						resolve(null);
					},
					0,
					callbackArgumentOne,
					callbackArgumentTwo
				);
				expect(timeoutId.constructor.name).toBe('Timeout');
			});
		});

		it('Catches errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.setTimeout(() => {
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 2);
			});
		});

		it('Catches async errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.setTimeout(async () => {
					await new Promise((resolve) => setTimeout(resolve, 0));
					throw new window.Error('Test error');
				}, 5);
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 15);
			});
		});
	});

	describe('queueMicrotask()', () => {
		it('Queues a microtask.', async () => {
			await new Promise((resolve) => {
				window.queueMicrotask(() => {
					resolve(null);
				});
			});
		});

		it('Makes it possible to cancel an ongoing microtask.', async () => {
			await new Promise((resolve) => {
				let isCallbackCalled = false;
				window.queueMicrotask(() => {
					isCallbackCalled = true;
					resolve(null);
				});
				window.happyDOM.cancelAsync();
				setTimeout(() => {
					expect(isCallbackCalled).toBe(false);
					resolve(null);
				});
			});
		});

		it('Catches errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.queueMicrotask(() => {
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 2);
			});
		});

		it('Catches async errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.queueMicrotask(async () => {
					await new Promise((resolve) => setTimeout(resolve, 0));
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 10);
			});
		});
	});

	describe('clearTimeout()', () => {
		it('Clears a timeout.', () => {
			const timeoutId = window.setTimeout(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.clearTimeout(timeoutId);
		});
	});

	describe('setInterval()', () => {
		it('Sets an interval.', async () => {
			await new Promise((resolve) => {
				let count = 0;
				const intervalId = window.setInterval(() => {
					count++;
					if (count > 2) {
						clearInterval(intervalId);
						resolve(null);
					}
				});
			});
		});

		it('Sets an interval with single argument.', async () => {
			await new Promise((resolve) => {
				const callbackArgumentOne = 'hello';
				let count = 0;
				const intervalId = window.setInterval(
					(message: string) => {
						expect(message).toBe(callbackArgumentOne);
						count++;
						if (count > 2) {
							clearInterval(intervalId);
							resolve(null);
						}
					},
					0,
					callbackArgumentOne
				);
			});
		});

		it('Sets an interval with multiple arguments.', async () => {
			await new Promise((resolve) => {
				const callbackArgumentOne = 'hello';
				const callbackArgumentTwo = 1337;
				let count = 0;
				const intervalId = window.setInterval(
					(message: string, num: number) => {
						expect(message).toBe(callbackArgumentOne);
						expect(num).toBe(callbackArgumentTwo);
						count++;
						if (count > 2) {
							clearInterval(intervalId);
							resolve(null);
						}
					},
					0,
					callbackArgumentOne,
					callbackArgumentTwo
				);
			});
		});

		it('Catches errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.setInterval(() => {
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 2);
			});
		});

		it('Catches async errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.setInterval(async () => {
					await new Promise((resolve) => setTimeout(resolve, 0));
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 10);
			});
		});
	});

	describe('clearInterval()', () => {
		it('Clears an interval.', () => {
			const intervalId = window.setInterval(() => {
				throw new Error('This interval should have been canceled.');
			});
			window.clearInterval(intervalId);
		});
	});

	describe('requestAnimationFrame()', () => {
		it('Requests an animation frame.', async () => {
			await new Promise((resolve) => {
				const timeoutId = window.requestAnimationFrame(resolve);
				expect(timeoutId.constructor.name).toBe('Immediate');
			});
		});

		it('Calls passed callback with current time', async () => {
			await new Promise((resolve) => {
				window.requestAnimationFrame((now) => {
					expect(Math.abs(now - window.performance.now())).toBeLessThan(100);
					resolve(null);
				});
			});
		});

		it('Catches errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.requestAnimationFrame(() => {
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 2);
			});
		});

		it('Catches async errors thrown in the callback.', async () => {
			await new Promise((resolve) => {
				let errorEvent: ErrorEvent | null = null;
				window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
				window.requestAnimationFrame(() => {
					throw new window.Error('Test error');
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 10);
			});
		});
	});

	describe('cancelAnimationFrame()', () => {
		it('Cancels an animation frame.', () => {
			const timeoutId = window.requestAnimationFrame(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.cancelAnimationFrame(timeoutId);
		});
	});

	describe('matchMedia()', () => {
		it('Returns a new MediaQueryList object that can then be used to determine if the document matches the media query string.', () => {
			window.happyDOM.setWindowSize({ width: 1024 });

			const mediaQueryString = '(max-width: 512px)';
			const mediaQueryList = window.matchMedia(mediaQueryString);
			expect(mediaQueryList.matches).toBe(false);
			expect(mediaQueryList.media).toBe(mediaQueryString);
			expect(mediaQueryList.onchange).toBe(null);

			expect(window.matchMedia('(max-width: 1024px)').matches).toBe(true);

			expect(typeof mediaQueryList.addEventListener).toBe('function');
			expect(typeof mediaQueryList.removeEventListener).toBe('function');
		});
	});

	describe('fetch()', () => {
		it(`Forwards the request to Fetch and calls Fetch.send().`, async () => {
			const expectedURL = 'https://localhost:8080/path/';
			const expectedResponse = <IResponse>{};
			const requestInit = {
				method: 'PUT',
				headers: {
					'test-header': 'test-value'
				}
			};
			let request: IRequest | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				request = <IRequest>this.request;
				return Promise.resolve(expectedResponse);
			});

			const response = await window.fetch(expectedURL, requestInit);

			expect(response).toBe(expectedResponse);
			expect((<IRequest>(<unknown>request)).url).toBe(expectedURL);
			expect((<IRequest>(<unknown>request)).headers.get('test-header')).toBe('test-value');
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop, scrollLeft, scrollY, scrollX, pageXOffset and pageYOffset', () => {
				window[functionName](50, 60);
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
				expect(window.pageXOffset).toBe(50);
				expect(window.pageYOffset).toBe(60);
				expect(window.scrollX).toBe(50);
				expect(window.scrollY).toBe(60);
			});

			it('Sets the properties scrollTop, scrollLeft, scrollY, scrollX, pageXOffset and pageYOffset using object.', () => {
				window[functionName]({ left: 50, top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
				expect(window.pageXOffset).toBe(50);
				expect(window.pageYOffset).toBe(60);
				expect(window.scrollX).toBe(50);
				expect(window.scrollY).toBe(60);
			});

			it('Sets only the property scrollTop, pageYOffset, and scrollY', () => {
				window[functionName]({ top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(60);
				expect(window.pageXOffset).toBe(0);
				expect(window.pageYOffset).toBe(60);
				expect(window.scrollX).toBe(0);
				expect(window.scrollY).toBe(60);
			});

			it('Sets only the property scrollLeft, pageXOffset, and scrollX', () => {
				window[functionName]({ left: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(60);
				expect(window.document.documentElement.scrollTop).toBe(0);
				expect(window.document.documentElement.scrollLeft).toBe(60);
				expect(window.document.documentElement.scrollTop).toBe(0);
				expect(window.pageXOffset).toBe(60);
				expect(window.pageYOffset).toBe(0);
				expect(window.scrollX).toBe(60);
				expect(window.scrollY).toBe(0);
			});

			it('Sets the properties scrollTop, scrollLeft, scrollY, scrollX, pageXOffset and pageYOffset with animation.', async () => {
				window[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(0);
				expect(window.pageXOffset).toBe(0);
				expect(window.pageYOffset).toBe(0);
				expect(window.scrollX).toBe(0);
				expect(window.scrollY).toBe(0);
				await window.happyDOM.whenAsyncComplete();
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
				expect(window.pageXOffset).toBe(50);
				expect(window.pageYOffset).toBe(60);
				expect(window.scrollX).toBe(50);
				expect(window.scrollY).toBe(60);
			});
		});
	}

	describe('getSelection()', () => {
		it('Returns selection.', () => {
			expect(window.getSelection() instanceof Selection).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Triggers "load" event if no resources needs to be loaded.', async () => {
			await new Promise((resolve) => {
				let loadEvent: Event | null = null;

				window.addEventListener('load', (event) => {
					loadEvent = event;
				});

				setTimeout(() => {
					expect((<Event>loadEvent).target).toBe(document);
					resolve(null);
				}, 1);
			});
		});

		it('Triggers "load" event when all resources have been loaded.', async () => {
			await new Promise((resolve) => {
				const cssURL = '/path/to/file.css';
				const jsURL = '/path/to/file.js';
				const cssResponse = 'body { background-color: red; }';
				const jsResponse = 'globalThis.test = "test";';
				let resourceFetchCSSDocument: IDocument | null = null;
				let resourceFetchCSSURL: string | null = null;
				let resourceFetchJSDocument: IDocument | null = null;
				let resourceFetchJSURL: string | null = null;
				let loadEvent: Event | null = null;

				vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
					async (document: IDocument, url: string) => {
						if (url.endsWith('.css')) {
							resourceFetchCSSDocument = document;
							resourceFetchCSSURL = url;
							return cssResponse;
						}

						resourceFetchJSDocument = document;
						resourceFetchJSURL = url;
						return jsResponse;
					}
				);

				window.addEventListener('load', (event) => {
					loadEvent = event;
				});

				const script = <IHTMLScriptElement>document.createElement('script');
				script.async = true;
				script.src = jsURL;

				const link = <IHTMLLinkElement>document.createElement('link');
				link.href = cssURL;
				link.rel = 'stylesheet';

				document.body.appendChild(script);
				document.body.appendChild(link);

				setTimeout(() => {
					expect(resourceFetchCSSDocument).toBe(document);
					expect(resourceFetchCSSURL).toBe(cssURL);
					expect(resourceFetchJSDocument).toBe(document);
					expect(resourceFetchJSURL).toBe(jsURL);
					expect((<Event>loadEvent).target).toBe(document);
					expect(document.styleSheets.length).toBe(1);
					expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

					expect(window['test']).toBe('test');

					resolve(null);
				}, 0);
			});
		});

		it('Triggers "error" event if there are problems loading resources.', async () => {
			await new Promise((resolve) => {
				const cssURL = '/path/to/file.css';
				const jsURL = '/path/to/file.js';
				const errorEvents: ErrorEvent[] = [];

				vi.spyOn(ResourceFetch, 'fetch').mockImplementation(
					async (_document: IDocument, url: string) => {
						throw new Error(url);
					}
				);

				window.addEventListener('error', (event) => {
					errorEvents.push(<ErrorEvent>event);
				});

				const script = <IHTMLScriptElement>document.createElement('script');
				script.async = true;
				script.src = jsURL;

				const link = <IHTMLLinkElement>document.createElement('link');
				link.href = cssURL;
				link.rel = 'stylesheet';

				document.body.appendChild(script);
				document.body.appendChild(link);

				setTimeout(() => {
					expect(errorEvents.length).toBe(2);
					expect(errorEvents[0].target).toBe(window);
					expect((<Error>errorEvents[0].error).message).toBe(jsURL);
					expect(errorEvents[1].target).toBe(window);
					expect((<Error>errorEvents[1].error).message).toBe(cssURL);

					resolve(null);
				}, 0);
			});
		});
	});

	describe('atob()', () => {
		it('Decode "hello my happy dom!"', () => {
			const encoded = 'aGVsbG8gbXkgaGFwcHkgZG9tIQ==';
			const decoded = window.atob(encoded);
			expect(decoded).toBe('hello my happy dom!');
		});

		it('Decode Unicode (throw error)', () => {
			expect(() => {
				const data = '😄 hello my happy dom! 🐛';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded contains characters outside of the Latin1 range.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});

		it('Data not in base64list', () => {
			expect(() => {
				const data = '\x11GVsbG8gbXkgaGFwcHkgZG9tIQ==';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
		it('Data length not valid', () => {
			expect(() => {
				const data = 'aGVsbG8gbXkgaGFwcHkgZG9tI';
				window.atob(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
	});

	describe('btoa()', () => {
		it('Encode "hello my happy dom!"', () => {
			const data = 'hello my happy dom!';
			const encoded = window.btoa(data);
			expect(encoded).toBe('aGVsbG8gbXkgaGFwcHkgZG9tIQ==');
		});

		it('Encode Unicode (throw error)', () => {
			expect(() => {
				const data = '😄 hello my happy dom! 🐛';
				window.btoa(data);
			}).toThrowError(
				new DOMException(
					"Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.",
					DOMExceptionNameEnum.invalidCharacterError
				)
			);
		});
	});

	describe('postMessage()', () => {
		it('Posts a message.', async () => {
			await new Promise((resolve) => {
				const message = 'test';
				const parentOrigin = 'https://localhost:8080';
				const parent = new Window({
					url: parentOrigin
				});
				let triggeredEvent: MessageEvent | null = null;

				(<Window>window.parent) = parent;

				window.addEventListener('message', (event) => (triggeredEvent = <MessageEvent>event));
				window.postMessage(message);

				expect(triggeredEvent).toBe(null);

				setTimeout(() => {
					expect((<MessageEvent>triggeredEvent).data).toBe(message);
					expect((<MessageEvent>triggeredEvent).origin).toBe(parentOrigin);
					expect((<MessageEvent>triggeredEvent).source).toBe(parent);
					expect((<MessageEvent>triggeredEvent).lastEventId).toBe('');

					triggeredEvent = null;
					window.postMessage(message, '*');
					expect(triggeredEvent).toBe(null);

					setTimeout(() => {
						expect((<MessageEvent>triggeredEvent).data).toBe(message);
						expect((<MessageEvent>triggeredEvent).origin).toBe(parentOrigin);
						expect((<MessageEvent>triggeredEvent).source).toBe(parent);
						expect((<MessageEvent>triggeredEvent).lastEventId).toBe('');
						resolve(null);
					}, 10);
				}, 10);
			});
		});

		it('Posts a data object as message.', async () => {
			await new Promise((resolve) => {
				const message = {
					test: 'test'
				};
				let triggeredEvent: MessageEvent | null = null;

				window.addEventListener('message', (event) => (triggeredEvent = <MessageEvent>event));
				window.postMessage(message);

				expect(triggeredEvent).toBe(null);

				setTimeout(() => {
					expect((<MessageEvent>triggeredEvent).data).toBe(message);
					resolve(null);
				}, 10);
			});
		});

		it("Throws an exception if the provided object can't be serialized.", function () {
			expect(() => window.postMessage(window)).toThrowError(
				new DOMException(
					`Failed to execute 'postMessage' on 'Window': The provided message cannot be serialized.`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Throws an exception if the target origin differs from the document origin.', () => {
			const message = 'test';
			const targetOrigin = 'https://localhost:8081';
			const documentOrigin = 'https://localhost:8080';

			window.happyDOM.setURL(documentOrigin);

			expect(() => window.postMessage(message, targetOrigin)).toThrowError(
				new DOMException(
					`Failed to execute 'postMessage' on 'Window': The target origin provided ('${targetOrigin}') does not match the recipient window\'s origin ('${documentOrigin}').`,
					DOMExceptionNameEnum.securityError
				)
			);
		});
	});
});
