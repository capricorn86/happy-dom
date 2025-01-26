import CSSStyleDeclaration from '../../src/css/declaration/CSSStyleDeclaration.js';
import Document from '../../src/nodes/document/Document.js';
import HTMLLinkElement from '../../src/nodes/html-link-element/HTMLLinkElement.js';
import HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import ResourceFetch from '../../src/fetch/ResourceFetch.js';
import HTMLScriptElement from '../../src/nodes/html-script-element/HTMLScriptElement.js';
import Window from '../../src/window/Window.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Navigator from '../../src/navigator/Navigator.js';
import Headers from '../../src/fetch/Headers.js';
import Selection from '../../src/selection/Selection.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import CustomElement from '../CustomElement.js';
import Request from '../../src/fetch/Request.js';
import Response from '../../src/fetch/Response.js';
import Fetch from '../../src/fetch/Fetch.js';
import MessageEvent from '../../src/event/events/MessageEvent.js';
import Event from '../../src/event/Event.js';
import ErrorEvent from '../../src/event/events/ErrorEvent.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Permissions from '../../src/permissions/Permissions.js';
import Clipboard from '../../src/clipboard/Clipboard.js';
import PackageVersion from '../../src/version.js';
import HTMLDialogElement from '../../src/nodes/html-dialog-element/HTMLDialogElement.js';
import Browser from '../../src/browser/Browser.js';
import CrossOriginBrowserWindow from '../../src/window/CrossOriginBrowserWindow.js';
import BrowserFrameFactory from '../../src/browser/utilities/BrowserFrameFactory.js';
import IBrowser from '../../src/browser/types/IBrowser.js';
import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import IBrowserPage from '../../src/browser/types/IBrowserPage.js';
import AdoptedStyleSheetCustomElement from '../AdoptedStyleSheetCustomElement.js';
import CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import Location from '../../src/location/Location.js';
import HTMLElementConfig from '../../src/config/HTMLElementConfig.js';

import '../types.d.js';
import EventTarget from '../../src/event/EventTarget.js';
import EventPhaseEnum from '../../src/event/EventPhaseEnum.js';
import { PerformanceEntry, PerformanceObserver } from 'perf_hooks';
import { URLSearchParams } from 'url';
import Stream from 'stream';
import { ReadableStream } from 'stream/web';
import SVGElementConfig from '../../src/config/SVGElementConfig.js';

const PLATFORM =
	'X11; ' +
	process.platform.charAt(0).toUpperCase() +
	process.platform.slice(1) +
	' ' +
	process.arch;

describe('BrowserWindow', () => {
	let browser: IBrowser;
	let browserPage: IBrowserPage;
	let browserFrame: IBrowserFrame;
	let window: BrowserWindow;
	let document: Document;

	beforeEach(() => {
		browser = new Browser();
		browserPage = browser.newPage();
		browserFrame = browserPage.mainFrame;
		window = browserFrame.window;
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
		window.customElements.define(
			'adopted-style-sheet-custom-element',
			AdoptedStyleSheetCustomElement
		);
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('get happyDOM()', () => {
		it('Returns "undefined" for an attached browser.', () => {
			expect(browserFrame.window['happyDOM']).toBeUndefined();
		});
	});

	describe('get document()', () => {
		it('Returns the document.', () => {
			expect(window.document).toBeInstanceOf(Document);

			expect(window.document.isConnected).toBe(true);
			expect(window.document.defaultView).toBe(window);

			expect(window.document.documentElement.ownerDocument).toBe(window.document);
			expect(window.document.documentElement.isConnected).toBe(true);
			expect(window.document.documentElement.getRootNode()).toBe(window.document);

			expect(window.document.head.ownerDocument).toBe(window.document);
			expect(window.document.head.isConnected).toBe(true);
			expect(window.document.head.getRootNode()).toBe(window.document);

			expect(window.document.body.ownerDocument).toBe(window.document);
			expect(window.document.body.isConnected).toBe(true);
			expect(window.document.body.getRootNode()).toBe(window.document);
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
			expect(new window.Headers()).toBeInstanceOf(Headers);
		});
	});

	describe('get Response()', () => {
		it('Returns Response class.', () => {
			const response = new window.Response();
			expect(response instanceof Response).toBe(true);
		});
	});

	describe('get Request()', () => {
		it('Returns Request class.', () => {
			const request = new window.Request('https://localhost:8080/test/page/');
			expect(request instanceof Request).toBe(true);
		});
	});

	describe('get PerformanceObserver()', () => {
		it('Returns PerformanceObserver class.', () => {
			expect(window.PerformanceObserver).toBe(PerformanceObserver);
			expect(window.PerformanceEntry).toBe(PerformanceEntry);
			expect(window.PerformanceObserverEntryList.name).toBe('PerformanceObserverEntryList');

			expect(() => new window.PerformanceObserverEntryList()).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get {ElementClass}()', () => {
		for (const tagName of Object.keys(HTMLElementConfig)) {
			it(`Exposes the HTML element class "${HTMLElementConfig[tagName].className}" for tag name "${tagName}"`, () => {
				expect(window[HTMLElementConfig[tagName].className].name).toBe(
					HTMLElementConfig[tagName].className
				);
			});
		}

		for (const tagName of Object.keys(SVGElementConfig)) {
			it(`Exposes the SVG element class "${SVGElementConfig[tagName]}" for tag name "${tagName}"`, () => {
				expect(window[SVGElementConfig[tagName].className].name).toBe(
					SVGElementConfig[tagName].className
				);
			});
		}
	});

	describe('get performance()', () => {
		it('Exposes "performance" from NodeJS.', () => {
			expect(typeof window.performance.now()).toBe('number');
		});
	});

	describe('get process()', () => {
		it('Returns undefined.', () => {
			expect(window['process']).toBeUndefined();
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

	describe('get TextEncoder()', () => {
		it('Returns an instance of TextEncoder.', () => {
			expect(window.TextEncoder).toBe(TextEncoder);
		});
	});

	describe('get TextDecoder()', () => {
		it('Returns an instance of TextDecoder.', () => {
			expect(window.TextDecoder).toBe(TextDecoder);
		});
	});

	describe('get location()', () => {
		it('Returns an instance of Location', () => {
			expect(window.location).toBeInstanceOf(Location);
		});
	});

	describe('set location()', () => {
		it('Sets the location.', () => {
			browser.settings.navigation.disableMainFrameNavigation = true;
			window.location = 'https://localhost:8080/test/page/';
			expect(window.location.href).toBe('https://localhost:8080/test/page/');
		});
	});

	describe('get navigator()', () => {
		it('Returns an instance of Navigator with browser data.', () => {
			expect(window.navigator instanceof Navigator).toBe(true);

			const referenceValues = {
				appCodeName: 'Mozilla',
				appName: 'Netscape',
				appVersion: `5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`,
				cookieEnabled: true,
				credentials: null,
				doNotTrack: 'unspecified',
				geolocation: null,
				hardwareConcurrency: 8,
				language: 'en-US',
				languages: ['en-US', 'en'],
				locks: null,
				maxTouchPoints: 0,
				mimeTypes: {
					length: 0
				},
				onLine: true,
				permissions: new Permissions(window),
				clipboard: new Clipboard(window),
				platform: PLATFORM,
				plugins: {
					length: 0
				},
				product: 'Gecko',
				productSub: '20100101',
				userAgent: `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`,
				vendor: '',
				vendorSub: '',
				webdriver: true
			};

			for (const propertyKey in referenceValues) {
				expect(window.navigator[propertyKey]).toEqual(referenceValues[propertyKey]);
			}
		});
	});

	describe('get innerWidth()', () => {
		it('Returns the viewport width.', () => {
			browserPage.setViewport({ width: 100 });
			expect(window.innerWidth).toBe(100);
		});
	});

	describe('set innerWidth()', () => {
		it('Sets inner width.', () => {
			window.innerWidth = 100;
			expect(window.innerWidth).toBe(100);
			expect(browserPage.viewport.width).toBe(1024);
		});
	});

	describe('get innerHeight()', () => {
		it('Returns the viewport height.', () => {
			browserPage.setViewport({ height: 100 });
			expect(window.innerHeight).toBe(100);
		});
	});

	describe('set innerHeight()', () => {
		it('Sets inner height.', () => {
			window.innerHeight = 100;
			expect(window.innerHeight).toBe(100);
			expect(browserPage.viewport.height).toBe(768);
		});
	});

	describe('get outerWidth()', () => {
		it('Returns the viewport width.', () => {
			browserPage.setViewport({ width: 100 });
			expect(window.outerWidth).toBe(100);
		});
	});

	describe('set outerWidth()', () => {
		it('Sets outer width.', () => {
			window.outerWidth = 100;
			expect(window.outerWidth).toBe(100);
			expect(browserPage.viewport.width).toBe(1024);
		});
	});

	describe('get outerHeight()', () => {
		it('Returns the viewport height.', () => {
			browserPage.setViewport({ height: 100 });
			expect(window.outerHeight).toBe(100);
		});
	});

	describe('set outerHeight()', () => {
		it('Sets outer height.', () => {
			window.outerHeight = 100;
			expect(window.outerHeight).toBe(100);
			expect(browserPage.viewport.height).toBe(768);
		});
	});

	describe('get devicePixelRatio()', () => {
		it('Returns the viewport devicePixelRatio.', () => {
			browserPage.setViewport({ devicePixelRatio: 2 });
			expect(window.devicePixelRatio).toBe(2);
		});
	});

	describe('set devicePixelRatio()', () => {
		it('Sets devicePixelRatio.', () => {
			window.devicePixelRatio = 2;
			expect(window.devicePixelRatio).toBe(2);
			expect(browserPage.viewport.devicePixelRatio).toBe(1);
		});
	});

	describe('get localStorage()', () => {
		it('Returns the "localStorage" object.', () => {
			expect(window.localStorage).toBeInstanceOf(window.Storage);
		});
	});

	describe('get sessionStorage()', () => {
		it('Returns the "sessionStorage" object.', () => {
			expect(window.sessionStorage).toBeInstanceOf(window.Storage);
		});
	});

	describe('get URLSearchParams()', () => {
		it('Returns the URLSearchParams class.', () => {
			expect(window.URLSearchParams).toBe(URLSearchParams);
		});
	});

	describe('get WritableStream()', () => {
		it('Returns the WritableStream class.', () => {
			expect(window.WritableStream).toBe(Stream.Writable);
		});
	});

	describe('get ReadableStream()', () => {
		it('Returns the ReadableStream class.', () => {
			expect(window.ReadableStream).toBe(ReadableStream);
		});
	});

	describe('get TransformStream()', () => {
		it('Returns the TransformStream class.', () => {
			expect(window.TransformStream).toBe(Stream.Transform);
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
			const element = document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.display).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.direction).toBe('ltr');
			expect(computedStyle.display).toBe('block');
		});

		it('Handles default properties "display" on a dialog element.', () => {
			const element = <HTMLDialogElement>document.createElement('dialog');
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
			const element = document.createElement('div');
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
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			browserFrame.page.setViewport({ width: 1024 });

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
			const element = document.createElement('span');
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
				<HTMLElement>customElement.shadowRoot?.querySelector('span')
			);

			// Default value on HTML is "16px Times New Roman"
			expect(elementComputedStyle.font).toBe('16px "Times New Roman"');
			expect(elementComputedStyle.color).toBe('green');

			expect(customElementComputedStyle.color).toBe('yellow');
			expect(customElementComputedStyle.font).toBe(
				'14px "Lucida Grande", Helvetica, Arial, sans-serif'
			);
		});

		it('Returns a CSSStyleDeclaration object with computed styles from adopted style sheets for elements in a HTMLShadowRoot.', () => {
			const element = document.createElement('span');
			const customElement = <CustomElement>(
				document.createElement('adopted-style-sheet-custom-element')
			);
			const elementComputedStyle = window.getComputedStyle(element);

			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(`
                span {
					color: green;
                }
            `);
			document.adoptedStyleSheets = [styleSheet];

			document.body.appendChild(element);
			document.body.appendChild(customElement);

			const customElementComputedStyle = window.getComputedStyle(
				<HTMLElement>customElement.shadowRoot?.querySelector('span')
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
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			browserFrame.page.setViewport({ width: 1024 });

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
			expect(computedStyle.font).toBe('14px Tahoma');
			expect(computedStyle.color).toBe('');
		});

		it('Returns values defined by a CSS variables when a fallback is used.', () => {
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			browserFrame.page.setViewport({ width: 1024 });

			parentStyle.innerHTML = `
                html {
                    font: 14px "Times New Roman";
                }

				div {
					--border-variable: 1px solid var(--color-variable, #000);
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
			expect(computedStyle.font).toBe('14px Tahoma');
			expect(computedStyle.color).toBe('');
		});

		it('Returns values defined by a CSS variables when multiple fallbacks are used', () => {
			const div = document.createElement('div');
			const divStyle = document.createElement('style');

			divStyle.innerHTML = `
				div {
					color: var(--my-var, var(--my-background, pink));

					--color1: red;
					--color2: blue;
					--result1: var(--color1, var(--unknown, var(--unknown, green)));
					--result2: var(--unknown, var(--color1, var(--unknown, green)));
					--result3: var(--unknown, var(--unknown, var(--color1, green)));

					--result4: var(--unknown, var(--unknown, var(--unknown, var(--unknown, white))));

					--result5: var(--color1, var(--color2));
					--result6: var(--unknown, var(--color2));
					--result7: var(--unknown, blue);
				}
			`;

			document.body.appendChild(divStyle);
			document.body.appendChild(div);

			const computedStyle = window.getComputedStyle(div);
			expect(computedStyle.color).toBe('pink');

			expect(computedStyle.getPropertyValue('--result1')).toBe('red');
			expect(computedStyle.getPropertyValue('--result2')).toBe('red');
			expect(computedStyle.getPropertyValue('--result2')).toBe('red');

			expect(computedStyle.getPropertyValue('--result4')).toBe('white');

			expect(computedStyle.getPropertyValue('--result5')).toBe('red');
			expect(computedStyle.getPropertyValue('--result6')).toBe('blue');
			expect(computedStyle.getPropertyValue('--result7')).toBe('blue');
		});

		it('Returns values defined by a CSS variables when multiple chained variables are used.', () => {
			const div = document.createElement('div');
			const divStyle = document.createElement('style');

			divStyle.innerHTML = `
				div {
					--my-var1: var(--my-var2);
					--my-var2: var(--my-var3);
					--my-var3: var(--my-var4);
					--my-var4: pink;


					--color1: red;
					--color2: blue;
					--case1-result1: var(--case1-result2);
					--case1-result2: var(--case1-result3);
					--case1-result3: var(--case1-result4);
					--case1-result4: var(--color1, var(--color2));

					--case2-result1: var(--case2-result2);
					--case2-result2: var(--case2-result3);
					--case2-result3: var(--case2-result4);
					--case2-result4: var(--unknown, var(--color2));
				}
			`;

			document.body.appendChild(divStyle);
			document.body.appendChild(div);

			const computedStyle = window.getComputedStyle(div);

			expect(computedStyle.getPropertyValue('--my-var1')).toBe('pink');
			expect(computedStyle.getPropertyValue('--my-var2')).toBe('pink');
			expect(computedStyle.getPropertyValue('--my-var3')).toBe('pink');
			expect(computedStyle.getPropertyValue('--my-var4')).toBe('pink');

			expect(computedStyle.getPropertyValue('--case1-result1')).toBe('red');
			expect(computedStyle.getPropertyValue('--case1-result2')).toBe('red');
			expect(computedStyle.getPropertyValue('--case1-result3')).toBe('red');
			expect(computedStyle.getPropertyValue('--case1-result4')).toBe('red');

			expect(computedStyle.getPropertyValue('--case2-result1')).toBe('blue');
			expect(computedStyle.getPropertyValue('--case2-result2')).toBe('blue');
			expect(computedStyle.getPropertyValue('--case2-result3')).toBe('blue');
			expect(computedStyle.getPropertyValue('--case2-result4')).toBe('blue');
		});

		it('Returns a CSSStyleDeclaration object with computed styles containing "rem" and "em" measurement values converted to pixels.', () => {
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			browserFrame.page.setViewport({ width: 1024 });

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
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

			browserFrame.page.setViewport({ width: 1024 });

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

		it('Returns a CSSStyleDeclaration object with computed styles containing "rem" and "em" measurement values that has not been converted to pixels if the Happy DOM setting "disableComputedStyleRendering" is set to "true".', () => {
			browser.settings.disableComputedStyleRendering = true;
			document = window.document;

			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const parentStyle = document.createElement('style');
			const elementStyle = document.createElement('style');

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

			expect(computedStyle.width).toBe('10rem');
			expect(computedStyle.height).toBe('10em');
		});

		it('Returns a CSSStyleDeclaration object with computed styles from style sheets using :is() and where().', () => {
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const elementStyle = document.createElement('style');

			elementStyle.innerHTML = `
                /* Should have 10 priority as :is() will use the tag match as priority */
				:is(span) {
					color: green;
				}

                /* Should have 0 priority as :is() will have 0 in priority */
				:where(span) {
					color: red;
				}
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parent);

			expect(computedStyle.color).toBe('green');
		});

		it('Handles variables in style attributes.', () => {
			const div = document.createElement('div');

			div.setAttribute('style', '--my-color1: pink;');

			const style = document.createElement('style');

			style.textContent = `
              div {
                border-color: var(--my-color1);
              }
            `;

			document.head.appendChild(style);
			document.body.appendChild(div);

			expect(window.getComputedStyle(div).getPropertyValue('border-color')).toBe('pink');
		});

		it('Handles variables in root pseudo element (:root).', () => {
			const div = document.createElement('div');
			const style = document.createElement('style');

			style.textContent = `
              :root {
                --my-color1: pink;
              }
              div {
                border-color: var(--my-color1);
              }
            `;

			document.head.appendChild(style);
			document.body.appendChild(div);

			expect(window.getComputedStyle(div).getPropertyValue('border-color')).toBe('pink');
		});

		it('Ingores invalid selectors in parsed CSS.', () => {
			const parent = document.createElement('div');
			const element = document.createElement('span');
			const computedStyle = window.getComputedStyle(element);
			const elementStyle = document.createElement('style');

			elementStyle.innerHTML = `
                span {
                    color: green;
                }

                :not {
                    color: red;
                }

                %test {
                    color: red;
                }

                span:not {
                    color: red;
                }
			`;

			parent.appendChild(elementStyle);
			parent.appendChild(element);

			document.body.appendChild(parent);

			expect(computedStyle.color).toBe('green');
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
				const element = document.createElement('div');
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
				});
				setTimeout(() => {
					expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
					expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Test error');
					expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Test error');
					resolve(null);
				}, 20);
			});
		});

		it('Supports preventing timeout loops when the setting "preventTimerLoops" is set to "true".', async () => {
			let loopCount = 0;

			browser.settings.timer.preventTimerLoops = false;

			const timeoutLoop = (): void => {
				if (loopCount < 10) {
					loopCount++;
					window.setTimeout(timeoutLoop, loopCount < 3 ? 1 : 0);
				}
			};

			timeoutLoop();

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(loopCount).toBe(10);

			browser.settings.timer.preventTimerLoops = true;

			loopCount = 0;

			timeoutLoop();

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(loopCount).toBe(3);
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
				process.nextTick(() => {});
				window.queueMicrotask(() => {
					isCallbackCalled = true;
					resolve(null);
				});
				browserFrame.abort();
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
				}, 20);
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

		it('Supports number values.', () => {
			window.clearTimeout(<NodeJS.Timeout>(<unknown>-1));
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
				}, 20);
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

		it('Supports number values.', () => {
			window.clearInterval(<NodeJS.Timeout>(<unknown>-1));
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
				}, 20);
			});
		});

		it('Supports preventing timeout loops when the setting "preventTimerLoops" is set to "true".', async () => {
			let loopCount = 0;

			browser.settings.timer.preventTimerLoops = false;

			const timeoutLoop = (): void => {
				if (loopCount < 10) {
					loopCount++;
					window.requestAnimationFrame(timeoutLoop);
				}
			};

			timeoutLoop();

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(loopCount).toBe(10);

			browser.settings.timer.preventTimerLoops = true;

			loopCount = 0;

			timeoutLoop();

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(loopCount).toBe(3);
		});
	});

	describe('cancelAnimationFrame()', () => {
		it('Cancels an animation frame.', () => {
			const timeoutId = window.requestAnimationFrame(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.cancelAnimationFrame(timeoutId);
		});

		it('Supports number values.', () => {
			window.cancelAnimationFrame(<NodeJS.Immediate>(<unknown>-1));
		});
	});

	describe('matchMedia()', () => {
		it('Returns a new MediaQueryList object that can then be used to determine if the document matches the media query string.', () => {
			browserFrame.page.setViewport({ width: 1024 });

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
			const expectedResponse = <Response>{};
			const requestInit = {
				method: 'PUT',
				headers: {
					'test-header': 'test-value'
				}
			};
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = <Request>this.request;
				return Promise.resolve(expectedResponse);
			});

			const response = await window.fetch(expectedURL, requestInit);

			expect(response).toBe(expectedResponse);
			expect((<Request>(<unknown>request)).url).toBe(expectedURL);
			expect((<Request>(<unknown>request)).headers.get('test-header')).toBe('test-value');
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
				await browserFrame.waitUntilComplete();
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
				expect(window.pageXOffset).toBe(50);
				expect(window.pageYOffset).toBe(60);
				expect(window.scrollX).toBe(50);
				expect(window.scrollY).toBe(60);
			});

			it('Throws an exception if the there is only one argument and it is not an object.', () => {
				expect(() => window[functionName](10)).toThrow(
					new TypeError(
						`Failed to execute '${functionName}' on 'Window': The provided value is not of type 'ScrollToOptions'.`
					)
				);
			});
		});
	}

	describe('scrollBy()', () => {
		it('Append the values to the current scroll position.', () => {
			window.scroll(50, 60);
			window.scrollBy(10, 20);
			expect(window.document.documentElement.scrollLeft).toBe(60);
			expect(window.document.documentElement.scrollTop).toBe(80);
			expect(window.pageXOffset).toBe(60);
			expect(window.pageYOffset).toBe(80);
			expect(window.scrollX).toBe(60);
			expect(window.scrollY).toBe(80);
		});

		it('Append the values to the current scroll position with object.', () => {
			window.scroll(50, 60);
			window.scrollBy({ left: 10, top: 20 });
			expect(window.document.documentElement.scrollLeft).toBe(60);
			expect(window.document.documentElement.scrollTop).toBe(80);
			expect(window.pageXOffset).toBe(60);
			expect(window.pageYOffset).toBe(80);
			expect(window.scrollX).toBe(60);
			expect(window.scrollY).toBe(80);
		});

		it('Supports smooth behavior.', async () => {
			window.scroll(50, 60);
			window.scrollBy({ left: 10, top: 20, behavior: 'smooth' });
			expect(window.document.documentElement.scrollLeft).toBe(50);
			expect(window.document.documentElement.scrollTop).toBe(60);
			expect(window.pageXOffset).toBe(50);
			expect(window.pageYOffset).toBe(60);
			expect(window.scrollX).toBe(50);
			expect(window.scrollY).toBe(60);
			await browserFrame.waitUntilComplete();
			expect(window.document.documentElement.scrollLeft).toBe(60);
			expect(window.document.documentElement.scrollTop).toBe(80);
			expect(window.pageXOffset).toBe(60);
			expect(window.pageYOffset).toBe(80);
			expect(window.scrollX).toBe(60);
			expect(window.scrollY).toBe(80);
		});

		it('Throws an exception if the there is only one argument and it is not an object.', () => {
			expect(() => window.scrollBy(10)).toThrow(
				new TypeError(
					"Failed to execute 'scrollBy' on 'Window': The provided value is not of type 'ScrollToOptions'."
				)
			);
		});
	});

	describe('getSelection()', () => {
		it('Returns selection.', () => {
			expect(window.getSelection() instanceof Selection).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Triggers "load" event if no resources needs to be loaded.', async () => {
			await new Promise((resolve) => {
				let event: Event | null = null;
				let target: EventTarget | null = null;
				let currentTarget: EventTarget | null = null;

				window.addEventListener('load', (e) => {
					event = e;
					target = e.target;
					currentTarget = e.currentTarget;
				});

				setTimeout(() => {
					expect((<Event>event).target).toBe(document);
					expect((<Event>event).currentTarget).toBe(null);
					expect((<Event>event).eventPhase).toBe(EventPhaseEnum.none);
					expect(target).toBe(document);
					expect(currentTarget).toBe(window);
					resolve(null);
				}, 20);
			});
		});

		it('Triggers "load" event when all resources have been loaded.', async () => {
			await new Promise((resolve) => {
				const cssURL = 'https://localhost:8080/path/to/file.css';
				const jsURL = 'https://localhost:8080/path/to/file.js';
				const cssResponse = 'body { background-color: red; }';
				const jsResponse = 'globalThis.test = "test";';
				let resourceFetchCSSWindow: BrowserWindow | null = null;
				let resourceFetchCSSURL: string | null = null;
				let resourceFetchJSWindow: BrowserWindow | null = null;
				let resourceFetchJSURL: string | null = null;
				let loadEvent: Event | null = null;
				let loadEventTarget: EventTarget | null = null;
				let loadEventCurrentTarget: EventTarget | null = null;

				vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
					url: string | URL
				) {
					if ((<string>url).endsWith('.css')) {
						resourceFetchCSSWindow = this.window;
						resourceFetchCSSURL = <string>url;
						return cssResponse;
					}

					resourceFetchJSWindow = this.window;
					resourceFetchJSURL = <string>url;
					return jsResponse;
				});

				window.addEventListener('load', (event) => {
					loadEvent = event;
					loadEventTarget = event.target;
					loadEventCurrentTarget = event.currentTarget;
				});

				const script = <HTMLScriptElement>document.createElement('script');
				script.async = true;
				script.src = jsURL;

				const link = <HTMLLinkElement>document.createElement('link');
				link.href = cssURL;
				link.rel = 'stylesheet';

				document.body.appendChild(script);
				document.body.appendChild(link);

				setTimeout(() => {
					expect(resourceFetchCSSWindow === window).toBe(true);
					expect(resourceFetchCSSURL).toBe(cssURL);
					expect(resourceFetchJSWindow === window).toBe(true);
					expect(resourceFetchJSURL).toBe(jsURL);
					expect((<Event>loadEvent).target).toBe(document);
					expect((<Event>loadEvent).currentTarget).toBe(null);
					expect((<Event>loadEvent).eventPhase).toBe(EventPhaseEnum.none);
					expect(loadEventTarget).toBe(document);
					expect(loadEventCurrentTarget).toBe(window);
					expect(document.styleSheets.length).toBe(1);
					expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

					expect(window['test']).toBe('test');

					resolve(null);
				}, 20);
			});
		});

		it('Triggers "error" when an error occurs in the executed code.', async () => {
			await new Promise((resolve) => {
				const errorEvents: ErrorEvent[] = [];

				window.addEventListener('error', (event) => {
					expect(event.target).toBe(window);
					errorEvents.push(<ErrorEvent>event);
				});

				const script = <HTMLScriptElement>document.createElement('script');
				script.innerText = 'throw new Error("Script error");';
				document.body.appendChild(script);

				window.setTimeout(() => {
					throw new Error('Timeout error');
				});

				setTimeout(() => {
					expect(errorEvents.length).toBe(2);
					expect(errorEvents[0].target).toBe(window);
					expect((<Error>errorEvents[0].error).message).toBe('Script error');
					expect(errorEvents[1].target).toBe(window);
					expect((<Error>errorEvents[1].error).message).toBe('Timeout error');

					resolve(null);
				}, 20);
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
				const frame = BrowserFrameFactory.createChildFrame(browserFrame);

				const message = 'test';
				let triggeredEvent: MessageEvent | null = null;

				browserFrame.url = 'https://localhost:8080/test/';

				frame.url = 'https://localhost:8080/iframe.html';
				frame.window.addEventListener('message', (event) => (triggeredEvent = <MessageEvent>event));
				frame.window.postMessage(message);

				expect(triggeredEvent).toBe(null);

				setTimeout(() => {
					expect((<MessageEvent>triggeredEvent).data).toBe(message);
					expect((<MessageEvent>triggeredEvent).origin).toBe('https://localhost:8080');
					expect((<MessageEvent>triggeredEvent).source).toBe(browserFrame.window);
					expect((<MessageEvent>triggeredEvent).lastEventId).toBe('');

					triggeredEvent = null;
					frame.window.postMessage(message, '*');
					expect(triggeredEvent).toBe(null);

					setTimeout(() => {
						expect((<MessageEvent>triggeredEvent).data).toBe(message);
						expect((<MessageEvent>triggeredEvent).origin).toBe('https://localhost:8080');
						expect((<MessageEvent>triggeredEvent).source).toBe(browserFrame.window);
						expect((<MessageEvent>triggeredEvent).lastEventId).toBe('');
						resolve(null);
					}, 20);
				}, 20);
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
				}, 20);
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

			browserFrame.url = documentOrigin;

			expect(() => window.postMessage(message, targetOrigin)).toThrowError(
				new DOMException(
					`Failed to execute 'postMessage' on 'Window': The target origin provided ('${targetOrigin}') does not match the recipient window\'s origin ('${documentOrigin}').`,
					DOMExceptionNameEnum.securityError
				)
			);
		});
	});

	describe('open()', () => {
		it('Opens a new window without URL.', () => {
			const newWindow = <Window>window.open();
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.location.href).toBe('about:blank');
		});

		it('Opens a URL with Javascript.', async () => {
			const newWindow = <Window>window.open(`javascript:document.write('Test');`);
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.location.href).toBe('about:blank');
			await new Promise((resolve) => setTimeout(resolve, 1));
			expect(newWindow.document.body.innerHTML).toBe('Test');
		});

		it('Dispatches error event when the Javascript code is invalid.', async () => {
			const newWindow = <Window>window.open(`javascript:document.write(test);`);
			let errorEvent: ErrorEvent | null = null;
			newWindow.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.location.href).toBe('about:blank');
			await new Promise((resolve) => setTimeout(resolve, 20));
			expect(String((<ErrorEvent>(<unknown>errorEvent)).error)).toBe(
				'ReferenceError: test is not defined'
			);
		});

		it('Opens a new window with URL.', async () => {
			const html = '<html><body>Test</body></html>';
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = <Request>this.request;
				return Promise.resolve(<Response>{
					text: () => new Promise((resolve) => setTimeout(() => resolve(html)))
				});
			});

			browserFrame.url = 'https://localhost:8080/test/';

			const newWindow = <Window>window.open('/path/to/file.html');
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.location.href).toBe('https://localhost:8080/path/to/file.html');
			expect((<Request>(<unknown>request)).url).toBe('https://localhost:8080/path/to/file.html');

			await new Promise((resolve) => {
				newWindow.addEventListener('load', () => {
					expect(newWindow.document.body.innerHTML).toBe('Test');
					expect(newWindow.opener).toBe(window);
					resolve(null);
				});
			});
		});

		it('Sets width, height, top and left when popup is set as a feature.', () => {
			const newWindow = <Window>(
				window.open('', '', 'popup=yes,width=100,height=200,top=300,left=400')
			);
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.innerWidth).toBe(100);
			expect(newWindow.innerHeight).toBe(200);
			expect(newWindow.screenLeft).toBe(400);
			expect(newWindow.screenX).toBe(400);
			expect(newWindow.screenTop).toBe(300);
			expect(newWindow.screenY).toBe(300);
		});

		it(`Doesn't Sets width, height, top and left when popup is set as a feature.`, () => {
			const newWindow = <Window>window.open('', '', 'width=100,height=200,top=300,left=400');
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.innerWidth).toBe(1024);
			expect(newWindow.innerHeight).toBe(768);
			expect(newWindow.screenLeft).toBe(0);
			expect(newWindow.screenX).toBe(0);
			expect(newWindow.screenTop).toBe(0);
			expect(newWindow.screenY).toBe(0);
		});

		it('Sets the target as name on the Window instance.', () => {
			const newWindow = <Window>window.open('', 'test');
			expect(newWindow).toBeInstanceOf(BrowserWindow);
			expect(newWindow.name).toBe('test');
		});

		it(`Doesn't set opener if "noopener" has been specified as a feature without an URL.`, () => {
			const browser = new Browser();
			const page = browser.newPage();
			const newWindow = <Window>page.mainFrame.window.open('', '', 'noopener');
			expect(newWindow).toBe(null);
			expect(browser.defaultContext.pages[1].mainFrame.window.opener).toBe(null);
		});

		it(`Doesn't set opener if "noopener" has been specified as a feature when opening an URL.`, () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('<html><body>Test</body></html>')
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://www.github.com/capricorn86/happy-dom/';
			const newWindow = <Window>page.mainFrame.window.open('/test/', '', 'noopener');
			expect(newWindow).toBe(null);
			expect(browser.defaultContext.pages[1].mainFrame.window.opener).toBe(null);
		});

		it('Opens a new window with a CORS URL.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const html = '<html><body>Test</body></html>';
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = <Request>this.request;
				return Promise.resolve(<Response>{
					text: () => new Promise((resolve) => setTimeout(() => resolve(html)))
				});
			});

			page.mainFrame.url = 'https://www.github.com/capricorn86/happy-dom/';

			const newWindow = <CrossOriginBrowserWindow>(
				page.mainFrame.window.open('https://developer.mozilla.org/en-US/docs/Web/API/Window/open')
			);

			expect(newWindow instanceof CrossOriginBrowserWindow).toBe(true);
			expect(browser.defaultContext.pages.length).toBe(2);
			expect(browser.defaultContext.pages[0]).toBe(page);
			expect(
				<CrossOriginBrowserWindow>(<unknown>browser.defaultContext.pages[1].mainFrame.window) ===
					newWindow
			).toBe(false);
			expect(browser.defaultContext.pages[1].mainFrame.url).toBe(
				'https://developer.mozilla.org/en-US/docs/Web/API/Window/open'
			);
			expect((<Request>(<unknown>request)).url).toBe(
				'https://developer.mozilla.org/en-US/docs/Web/API/Window/open'
			);

			await new Promise((resolve) => {
				browser.defaultContext.pages[1].mainFrame.window.addEventListener('load', () => {
					expect(browser.defaultContext.pages[1].mainFrame.content).toBe(
						'<html><head></head><body>Test</body></html>'
					);

					newWindow.close();

					expect(browser.defaultContext.pages.length).toBe(1);
					expect(browser.defaultContext.pages[0]).toBe(page);
					expect(newWindow.closed).toBe(true);
					resolve(null);
				});
			});
		});

		it("Outputs error to the console if the request can't be resolved.", async () => {
			const browser = new Browser();
			const page = browser.newPage();

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.reject(new Error('Test error'));
			});

			<Window>page.mainFrame.window.open('https://www.github.com/');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(
				browser.defaultContext.pages[1].virtualConsolePrinter
					.readAsString()
					.startsWith('Error: Test error\n')
			).toBe(true);
		});
	});

	describe('resizeTo()', () => {
		it(`Doesn't resize a non-popup window.`, () => {
			window.resizeTo(100, 200);
			expect(window.innerWidth).toBe(1024);
			expect(window.innerHeight).toBe(768);
			expect(window.outerWidth).toBe(1024);
			expect(window.outerHeight).toBe(768);
		});

		it(`Resize a popup window.`, () => {
			const newWindow = <Window>window.open('', '', 'popup');
			newWindow.resizeTo(100, 200);
			expect(newWindow.innerWidth).toBe(100);
			expect(newWindow.innerHeight).toBe(200);
			expect(newWindow.outerWidth).toBe(100);
			expect(newWindow.outerHeight).toBe(200);
		});
	});

	describe('resizeBy()', () => {
		it(`Doesn't resize a non-popup window.`, () => {
			window.resizeBy(-100, -200);
			expect(window.innerWidth).toBe(1024);
			expect(window.innerHeight).toBe(768);
			expect(window.outerWidth).toBe(1024);
			expect(window.outerHeight).toBe(768);
		});

		it(`Resize a popup window.`, () => {
			const newWindow = <Window>window.open('', '', 'popup');
			newWindow.resizeBy(-100, -200);
			expect(newWindow.innerWidth).toBe(1024 - 100);
			expect(newWindow.innerHeight).toBe(768 - 200);
			expect(newWindow.outerWidth).toBe(1024 - 100);
			expect(newWindow.outerHeight).toBe(768 - 200);
		});
	});
	describe('Object.getOwnPropertyNames()', () => {
		it('Returns property names for Vitest.', () => {
			const expected = [
				'location',
				'history',
				'navigator',
				'screen',
				'sessionStorage',
				'localStorage',
				'opener',
				'scrollX',
				'pageXOffset',
				'scrollY',
				'pageYOffset',
				'CSS',
				'innerWidth',
				'innerHeight',
				'outerWidth',
				'outerHeight',
				'devicePixelRatio'
			];
			const included: string[] = [];
			const propertyNames = Object.getOwnPropertyNames(window);
			for (const name of expected) {
				if (propertyNames.includes(name)) {
					included.push(name);
				}
			}

			expect(included).toEqual(expected);
		});
	});
});
